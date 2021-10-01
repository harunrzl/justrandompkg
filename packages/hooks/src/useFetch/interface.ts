export interface OptionPropsInterface {
  headers?: Record<string, unknown>;
  body?: Record<string, unknown>;
  mockedData?: Record<string, unknown>;
  skip?: boolean;
  variables?: Record<string, string>;
  onCompleted?: (e: Record<string, unknown>) => void;
  onError?: (e: Record<string, unknown>) => void;
}

export interface FetcherProps {
  body?: Record<string, unknown> | null;
  headers?: Record<string, unknown> | null;
  method?: string | null;
  mockedData?: Record<string, unknown> | null;
  retryCount?: number;
  type?: string | null;
  url?: string | null;
  variables?: Record<string, string>;
}
