export class VoucherError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "VoucherError";

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, VoucherError);
    }
  }
}
