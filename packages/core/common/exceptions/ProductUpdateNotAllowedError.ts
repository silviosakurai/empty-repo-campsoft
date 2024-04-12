export class ProductUpdateNotAllowedError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ProductUpdateNotAllowedError";

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, ProductUpdateNotAllowedError);
    }
  }
}
