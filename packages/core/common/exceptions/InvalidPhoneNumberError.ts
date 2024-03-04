export class InvalidPhoneNumberError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "InvalidPhoneNumberError";

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, InvalidPhoneNumberError);
    }
  }
}
