export class BannerItemNotFoundError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "BannerItemNotFoundError";

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, BannerItemNotFoundError);
    }
  }
}
