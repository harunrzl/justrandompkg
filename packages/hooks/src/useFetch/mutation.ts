import { useContext, useState } from 'react';
import isEmpty from './utils/isEmpty';

import { FetchContext } from './context';
import fetcher from './helpers/fetcher';

import { FetcherProps, OptionPropsInterface } from './interface';
import { ReturnedDataType } from './types';

/**
 * @function useFetchMutation useFetch for mutation
 *
 * @example
 *
 * const [updateData] = useFetchMutation(urlToFetch);
 * const handleUpdate = async dataToSend => {
 *   const { data, error } = await updateData({
 *     method: 'POST',
 *     body: JSON.stringify({
 *       var1: val1,
 *       var2: val2,
 *     }),
 *   });
 *
 *   if (error) {
 *     message.error(error.message);
 *     return;
 *   }
 *
 *   message.success('Successfully updated data');
 * });
 *
 * ** string body by default set header to application/json
 * ** or you can use `variables` for JSON body
 * const handleUpdate = async dataToSend => {
 *   const { data, error } = await updateData({
 *     method: 'POST',
 *     variables: {
 *       var1: val1,
 *       var2: val2,
 *     },
 *   });
 * });
 *
 */

const defaultMutationState = {
  data: null,
  error: null,
  headers: null,
  loading: false,
  status: 0,
};

const useFetchMutation = (url: string, opts?: OptionPropsInterface) => {
  const [contextState] = useContext(FetchContext);
  const { onBeforeFetchDefault, onAfterFetchDefault } = contextState || {};
  const [state, setState] = useState<ReturnedDataType>({ ...defaultMutationState });

  const refetch = async (newFetcherProps: FetcherProps = {}) => {
    // set called & loading state first
    setState((currentState: ReturnedDataType) => ({ ...currentState, called: true, loading: true }));

    const { onCompleted, onError, ...fetcherProps } = opts || {};
    const returnedData = await fetcher(
      {
        ...fetcherProps,
        ...(!isEmpty(newFetcherProps) && newFetcherProps.type !== 'click' && newFetcherProps),
        url: newFetcherProps.url || url,
      },
      { onAfterFetchDefault, onBeforeFetchDefault },
    );

    // set state with returned data
    setState((currentState: ReturnedDataType) => ({ ...currentState, ...returnedData, loading: false }));

    // callback after fetch completed
    if (returnedData.error && typeof onError === 'function') onError(returnedData.error);
    if (returnedData.data && typeof onCompleted === 'function') onCompleted(returnedData.data);

    return returnedData;
  };

  return [refetch, state];
};

export default useFetchMutation;
