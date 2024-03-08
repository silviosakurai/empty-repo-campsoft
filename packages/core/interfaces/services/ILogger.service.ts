export type ILoggerService = {
  info: (message: any) => void;
  error: (message: any) => void;
  debug: (message: any) => void;
};
