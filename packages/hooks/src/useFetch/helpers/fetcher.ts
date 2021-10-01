import { FetcherProps } from '../interface';
import { ContextStateType, ReturnedDataType } from '../types';

import doFetch from './doFetch';
import getFetcherProps from './getFetcherProps';

const fetcher: any = async (fetcherInitialProps: FetcherProps, opts?: ContextStateType) => {
  const { onAfterFetchDefault, onBeforeFetchDefault, ssrFetched } = opts || {};
  const { mockedData, ...otherOpts } = fetcherInitialProps || {};

  let fetcherProps = { ...otherOpts };
  let returnedData: Record<string, unknown> = { data: null, error: null, headers: null };

  if (typeof onBeforeFetchDefault === 'function') {
    const beforeFetchDefaultData = (await onBeforeFetchDefault(fetcherProps)) || {};
    fetcherProps = { ...beforeFetchDefaultData };
  }

  // You can pass mockedData if your backend does not ready yet
  if (mockedData) {
    returnedData.data = mockedData;
    return returnedData;
  }

  const [urlToSend, params] = getFetcherProps(fetcherProps);

  // Skip fetch on client if already defined from server
  if (ssrFetched && ssrFetched[urlToSend]) {
    returnedData.headers = new Map(ssrFetched[urlToSend].headers);
    returnedData.data = ssrFetched[urlToSend].data;
    returnedData.status = ssrFetched[urlToSend].status;
    return returnedData;
  }

  // Fetch starts here
  const { data, error, headers: resHeaders, status }: ReturnedDataType = await doFetch(urlToSend, params);
  returnedData = {
    headers: new Map(resHeaders),
    data,
    error,
    status,
  };

  if (typeof onAfterFetchDefault === 'function') {
    const { retryCount = 0 } = fetcherProps;
    const { retrying, ...newReturnedData } = await onAfterFetchDefault({ ...returnedData, retryCount });

    if (retrying) {
      return await fetcher({ ...fetcherProps, retryCount: retryCount + 1 });
    }

    returnedData = { ...returnedData, ...newReturnedData };
    return returnedData;
  }

  // default error handling when custom error not provided
  if (data?.error) {
    const { code, error: errType, message: errMsg } = data;
    returnedData.error = { name: code, error: errType, message: errMsg };
  }

  return returnedData;
};

export default fetcher;
