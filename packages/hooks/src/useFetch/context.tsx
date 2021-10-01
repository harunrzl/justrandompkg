import React, { createContext, useReducer } from 'react';
import { ContextStateType, ContextActionType } from './types';

const initialState = {
  ssrFetched: null,
  onAfterFetchDefault: undefined,
  onBeforeFetchDefault: undefined,
};

const reducer = (state: ContextStateType, action: ContextActionType): ContextStateType => {
  if (!action) {
    return state;
  }

  switch (action.type) {
    default: {
      console.error(`Invalid dispatch action:`, action.type);
      return state;
    }
  }
};

export const FetchContext = createContext<any[]>([]);

const FetchProvider: React.FC<ContextStateType> = ({
  children,
  ssrFetched,
  onAfterFetchDefault,
  onBeforeFetchDefault,
}) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const newState = { ...state, ssrFetched, onAfterFetchDefault, onBeforeFetchDefault };

  return <FetchContext.Provider value={[newState, dispatch]}>{children}</FetchContext.Provider>;
};

export default FetchProvider;
