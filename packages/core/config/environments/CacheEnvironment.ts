import * as dotenv from "dotenv";
import InvalidConfigurationError from "@core/common/exceptions/InvalidConfigurationError";

dotenv.config({
  path: "../../.env",
});

export class CacheEnvironment {
  private readonly DB_CACHE_HOST: string | undefined;
  private readonly DB_CACHE_PORT: number | undefined;
  private readonly DB_CACHE_PASSWORD: string | undefined;
  private readonly DB_CACHE_USER: string | undefined;

  constructor() {
    this.DB_CACHE_HOST = process.env.DB_CACHE_HOST;
    this.DB_CACHE_PORT = Number(process.env.DB_CACHE_PORT);
    this.DB_CACHE_PASSWORD = process.env.DB_CACHE_PASSWORD;
    this.DB_CACHE_USER = process.env.DB_CACHE_USER;
  }

  public get cacheHost(): string {
    if (!this.DB_CACHE_HOST) {
      throw new InvalidConfigurationError("DB_CACHE_HOST is not defined.");
    }

    return this.DB_CACHE_HOST;
  }

  public get cachePort(): number {
    if (!this.DB_CACHE_PORT) {
      throw new InvalidConfigurationError("DB_CACHE_PORT is not defined.");
    }

    return this.DB_CACHE_PORT;
  }

  public get cachePassword(): string {
    if (!this.DB_CACHE_PASSWORD) {
      throw new InvalidConfigurationError("DB_CACHE_PASSWORD is not defined.");
    }

    return this.DB_CACHE_PASSWORD;
  }

  public get cacheUser(): string {
    if (!this.DB_CACHE_USER) {
      throw new InvalidConfigurationError("DB_CACHE_USER is not defined.");
    }

    return this.DB_CACHE_USER;
  }
}
