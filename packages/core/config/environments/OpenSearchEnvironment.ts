import * as dotenv from "dotenv";
import InvalidConfigurationError from "@core/common/exceptions/InvalidConfigurationError";

dotenv.config({
  path: "../../.env",
});

export class OpenSearchEnvironment {
  private readonly OPEN_SEARCH_HOST: string | undefined;
  private readonly OPEN_SEARCH_USER: string | undefined;
  private readonly OPEN_SEARCH_PASSWORD: string | undefined;

  constructor() {
    this.OPEN_SEARCH_HOST = process.env.OPEN_SEARCH_HOST;
    this.OPEN_SEARCH_USER = process.env.OPEN_SEARCH_USER;
    this.OPEN_SEARCH_PASSWORD = process.env.OPEN_SEARCH_PASSWORD;
  }

  public get openSearchHost(): string {
    if (!this.OPEN_SEARCH_HOST) {
      throw new InvalidConfigurationError("OPEN_SEARCH_HOST is not defined.");
    }

    return this.OPEN_SEARCH_HOST;
  }

  public get openSearchUser(): string {
    if (!this.OPEN_SEARCH_USER) {
      throw new InvalidConfigurationError("OPEN_SEARCH_USER is not defined.");
    }

    return this.OPEN_SEARCH_USER;
  }

  public get openSearchPassword(): string {
    if (!this.OPEN_SEARCH_PASSWORD) {
      throw new InvalidConfigurationError(
        "OPEN_SEARCH_PASSWORD is not defined."
      );
    }

    return this.OPEN_SEARCH_PASSWORD;
  }
}
