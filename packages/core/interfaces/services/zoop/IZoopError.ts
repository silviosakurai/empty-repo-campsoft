export interface IZoopError {
  error: {
    status: string;
    status_code: string;
    type: string;
    category: string;
    message: string;
  };
}
