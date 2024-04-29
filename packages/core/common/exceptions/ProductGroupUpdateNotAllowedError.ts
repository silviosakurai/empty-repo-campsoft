export class ProductGroupUpdateNotAllowedError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ProductGroupUpdateNotAllowedError";

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, ProductGroupUpdateNotAllowedError);
    }
  }
}
