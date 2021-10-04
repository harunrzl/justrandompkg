// @flow
import { useCallback, useEffect, useRef, useContext, useState } from 'react';

import isEmpty from './utils/isEmpty';
import isEqual from './utils/isEqual';

import usePrevious from '../usePrevious';

import { FetchContext } from './context';
import fetcher from './helpers/fetcher';
import getInitialState from './helpers/getInitialState';

import { FetcherProps, OptionPropsInterface } from './interface';
import { ReturnedDataType } from './types';

/**
 * @function useFetch hooks for fetching data
 * @param {String} url the url to fetch
 * @param {Object} Obj.headers optional, request headers
 * @param {Object} Obj.body optional, body to send request body
 * @param {Object} Obj.mockedData optional, to mocked data
 * @param {Boolean} Obj.skip optional, to skip the first fetch
 * @param {Function} Obj.onCompleted optional, callback when the fetch is completed
 * @param {Function} Obj.onError optional, callback when the fetch is error
 * @param {Object} Obj.opts optinal, put any object here
 * @returns {Object}
 *
 * @example
 *
 * ** Case 1 - simple fetch
 * const { data, error, loading } = useFetch(urlToFetch);
 *
 * ** Case 2 - lazy fetch using `skip: true`, trigger by `refetch()`
 * const { data, error, loading, refetch } = useFetch(urlToFetch, { skip: true });
 *
 * ** Case 3 - need to normalize data
 * const { loading, refetch } = useFetch(urlToFetch, {
 *   onError: error => message.error(`Something wrong: ${error.message}`);
 *   onCompleted: responseData => {
 *     const normalizedData = normalizeData(responseData);
 *     // do something here
 *     setData(normalizedData);
 *   },
 * });
 *
 * ** Case 4 - need to send body
 * const { loading, refetch } = useFetch(urlToFetch, {
 *   method: 'POST',
 *   body: JSON.stringify({
 *     var1: val1,
 *     var2: val2,
 *     var3: val3,
 *   }),
 * });
 *
 * ** string body by default set header to application/json
 * ** or you can use `variables` for JSON body
 * const { loading, fetchMore } = useFetch(urlToFetch, {
 *   method: 'POST',
 *   variables: {
 *     var1: val1,
 *     var2: val2,
 *     var3: val3,
 *   },
 * });
 *
 * ** Case 5 - need to mock data since your backend does not ready yet
 * const { data, loading } = useFetch(urlToFetch, { mockedData: importedMockedData });
 *
 */

const useFetch = (url: string, opts?: OptionPropsInterface) => {
  const [contextState] = useContext(FetchContext);
  const { ssrFetched, onBeforeFetchDefault, onAfterFetchDefault } = contextState || {};

  const hasFetched = useRef(false);
  const [state, setState] = useState<ReturnedDataType>(getInitialState({ ssrFetched, url, ...opts }));

  const prevUrl = usePrevious(url);
  const prevVariables = usePrevious(opts?.variables);

  const handleFetch: any = useCallback(
    async (fetcherInitialProps: FetcherProps) =>
      fetcher(fetcherInitialProps, { onAfterFetchDefault, onBeforeFetchDefault, ssrFetched }),
    [onAfterFetchDefault, onBeforeFetchDefault, ssrFetched],
  );

  const refetch = async (newFetcherProps: FetcherProps = {}) => {
    // set called & loading state first
    setState((currentState: ReturnedDataType) => ({ ...currentState, loading: true }));

    const { skip, onCompleted, onError, ...fetcherProps } = opts || {};
    const returnedData = await handleFetch({
      ...fetcherProps,
      ...(!isEmpty(newFetcherProps) && newFetcherProps.type !== 'click' && newFetcherProps),
      url: newFetcherProps.url || url,
    });

    // set state with returned data
    setState((currentState: ReturnedDataType) => ({ ...currentState, ...returnedData, loading: false }));

    // callback after fetch completed
    if (returnedData.error && typeof onError === 'function') onError(returnedData.error);
    if (returnedData.data && typeof onCompleted === 'function') onCompleted(returnedData.data);

    return returnedData;
  };

  useEffect(() => {
    const { skip, onCompleted, onError, ...fetcherProps } = opts || {};

    if (skip) return;

    if (hasFetched.current) {
      // return if prev and current url & variables is equal
      if (isEqual(prevUrl, url) && isEqual(opts?.variables, prevVariables)) {
        return;
      }

      // reset hasFetched
      hasFetched.current = false;
    }

    const fetchWrapper = async () => {
      const returnedData = await handleFetch({ ...fetcherProps, url });

      // set state with returned data
      setState((currentState: ReturnedDataType) => ({ ...currentState, ...returnedData, loading: false }));

      // callback after fetch completed
      if (returnedData.error && typeof onError === 'function') onError(returnedData.error);
      if (returnedData.data && typeof onCompleted === 'function') onCompleted(returnedData.data);
    };

    // reset loading state
    if (!state.loading) setState((currentState: ReturnedDataType) => ({ ...currentState, loading: true }));

    hasFetched.current = true;
    fetchWrapper();
  }, [handleFetch, opts, prevUrl, prevVariables, state.loading, url]);

  return { ...state, called: hasFetched.current, refetch };
};

export default useFetch;
