import getFetcherProps from './getFetcherProps';

import { ReturnedDataType, SsrFetchedType } from '../types';

interface GetInitialStateInterface {
  ssrFetched?: SsrFetchedType;
  skip?: boolean;
  url: string;
}

const defaultState = {
  data: null,
  error: null,
  headers: null,
  loading: true,
  status: 0,
};

const getInitialState = ({ ssrFetched, skip, ...opts }: GetInitialStateInterface) => {
  const returnedData: ReturnedDataType = { ...defaultState, loading: !skip };
  const [urlToSend] = getFetcherProps(opts);

  if (!skip && ssrFetched && ssrFetched[urlToSend]) {
    returnedData.headers = new Map(ssrFetched[urlToSend].headers);
    returnedData.data = ssrFetched[urlToSend].data;
    returnedData.loading = false;
    returnedData.status = ssrFetched[urlToSend].status;
    return returnedData;
  }

  return returnedData;
};

export default getInitialState;
