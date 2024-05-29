export class TFAVerificationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "TFAVerificationError";

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, TFAVerificationError);
    }
  }
}
