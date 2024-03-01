export interface ResponseService<T = any> {
  status: boolean;
  message?: string;
  httpStatusCode?: number
  data?: T;
}