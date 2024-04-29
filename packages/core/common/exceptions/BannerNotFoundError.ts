export class BannerNotFoundError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "BannerNotFoundError";

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, BannerNotFoundError);
    }
  }
}
