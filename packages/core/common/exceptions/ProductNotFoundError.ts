export class ProductNotFoundError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ProductNotFoundError";

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, ProductNotFoundError);
    }
  }
}
