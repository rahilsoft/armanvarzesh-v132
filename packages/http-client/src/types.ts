export type TokenProvider = () => Promise<string | null> | string | null;
export type RefreshHandler = () => Promise<string | null> | string | null;

export type ClientOptions = {
  baseURL?: string;
  getToken?: TokenProvider;
  onRefreshToken?: RefreshHandler;
  timeoutMs?: number;
  withCredentials?: boolean;
};

export type ApiError = {
  message: string;
  status?: number;
  code?: string | number;
  isNetworkError?: boolean;
  details?: any;
};
