export type ILoggerService = {
  fatal: (message: any) => void;
  error: (message: any) => void;
  warn: (message: any) => void;
  info: (message: any) => void;
  debug: (message: any) => void;
  trace: (message: any) => void;
};
