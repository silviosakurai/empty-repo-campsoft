export interface ResponseService<T = unknown> {
  status: boolean;
  message?: string;
  httpStatusCode?: number
  data?: T;
}