export class ProductGroupNotFoundError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ProductGroupNotFoundError";

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, ProductGroupNotFoundError);
    }
  }
}
