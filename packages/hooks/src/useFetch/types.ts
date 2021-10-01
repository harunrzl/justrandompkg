export type ReturnedDataType = {
  data: Record<string, unknown> | null;
  error: Record<string, unknown> | null;
  headers: any;
  called?: boolean;
  loading?: boolean;
  status: number;
};

export type SsrFetchedType = {
  [key: string]: ReturnedDataType;
};

type AfterFetchType = {
  retrying?: number | null;
};

export type ContextStateType = {
  ssrFetched?: SsrFetchedType | null;
  onAfterFetchDefault?: (e: Record<string, unknown>) => Promise<AfterFetchType>;
  onBeforeFetchDefault?: (e: Record<string, unknown>) => Promise<Record<string, unknown>>;
};

export type ContextActionType = {
  type: string;
  payload: number;
};
