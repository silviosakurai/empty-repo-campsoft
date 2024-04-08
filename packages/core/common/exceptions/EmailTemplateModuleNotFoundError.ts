export class EmailTemplateModuleNotFoundError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "EmailTemplateModuleNotFoundError";

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, EmailTemplateModuleNotFoundError);
    }
  }
}
