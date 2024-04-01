import * as dotenv from "dotenv";
import InvalidConfigurationError from "@core/common/exceptions/InvalidConfigurationError";
import { AppEnvironment } from "@core/common/enums/AppEnvironment";

dotenv.config({
  path: "../../.env",
});

export class GeneralEnvironment {
  private readonly APP_ENVIRONMENT: AppEnvironment | undefined;
  private readonly APP_URL_PUBLIC: string | undefined;
  private readonly APP_URL_PARTNER: string | undefined;
  private readonly JWT_SECRET: string | undefined;
  private readonly JWT_SECRET_EXPIRES_IN: string | undefined;
  private readonly BASE_URL_CAMPSOFT_API: string | undefined;
  private readonly API_KEY_CAMPSOFT: string | undefined;
  private readonly ZOOP_BASE_URL: string | undefined;
  private readonly ZOOP_API_KEY: string | undefined;
  private readonly ZOOP_MARKETPLACE_KEY: string | undefined;

  constructor() {
    this.APP_ENVIRONMENT = process.env
      .APP_ENVIRONMENT as unknown as AppEnvironment;
    this.APP_URL_PUBLIC = process.env.APP_URL_PUBLIC;
    this.APP_URL_PARTNER = process.env.APP_URL_PARTNER;
    this.JWT_SECRET = process.env.JWT_SECRET;
    this.JWT_SECRET_EXPIRES_IN = process.env.JWT_SECRET_EXPIRES_IN;
    this.API_KEY_CAMPSOFT = process.env.API_KEY_CAMPSOFT;
    this.BASE_URL_CAMPSOFT_API = process.env.BASE_URL_CAMPSOFT_API;
    this.ZOOP_BASE_URL = process.env.ZOOP_BASE_URL;
    this.ZOOP_API_KEY = process.env.ZOOP_API_KEY;
    this.ZOOP_MARKETPLACE_KEY = process.env.ZOOP_MARKETPLACE_KEY;
  }

  public get appEnvironment(): AppEnvironment {
    if (!this.APP_ENVIRONMENT) {
      throw new InvalidConfigurationError("APP_ENVIRONMENT is not defined.");
    }

    if (
      this.APP_ENVIRONMENT !== AppEnvironment.LOCAL &&
      this.APP_ENVIRONMENT !== AppEnvironment.DEV &&
      this.APP_ENVIRONMENT !== AppEnvironment.HMG &&
      this.APP_ENVIRONMENT !== AppEnvironment.PROD
    ) {
      throw new InvalidConfigurationError("APP_ENVIRONMENT is not valid.");
    }

    return this.APP_ENVIRONMENT;
  }

  public get appUrlPublic(): string {
    if (!this.APP_URL_PUBLIC) {
      throw new InvalidConfigurationError("APP_URL_PUBLIC is not defined.");
    }

    return this.APP_URL_PUBLIC;
  }

  public get appUrlPartner(): string {
    if (!this.APP_URL_PARTNER) {
      throw new InvalidConfigurationError("APP_URL_PARTNER is not defined.");
    }

    return this.APP_URL_PARTNER;
  }

  public get jwtSecret(): string {
    if (!this.JWT_SECRET) {
      throw new InvalidConfigurationError("JWT_SECRET is not defined.");
    }

    return this.JWT_SECRET;
  }

  public get jwtSecretExpiresIn(): string {
    if (!this.JWT_SECRET_EXPIRES_IN) {
      throw new InvalidConfigurationError(
        "JWT_SECRET_EXPIRES_IN is not defined."
      );
    }

    return this.JWT_SECRET_EXPIRES_IN;
  }

  public get apiKeyCampsoft(): string {
    if (!this.API_KEY_CAMPSOFT) {
      throw new InvalidConfigurationError("API_KEY_CAMPSOFT is not defined.");
    }

    return this.API_KEY_CAMPSOFT;
  }

  public get apiCampsoft(): string {
    if (!this.BASE_URL_CAMPSOFT_API) {
      throw new InvalidConfigurationError(
        "BASE_URL_CAMPSOFT_API is not defined."
      );
    }

    return this.BASE_URL_CAMPSOFT_API;
  }

  public get zoopBaseUrl(): string {
    if (!this.ZOOP_BASE_URL) {
      throw new InvalidConfigurationError(
        "ZOOP_BASE_URL is not defined."
      );
    }

    return this.ZOOP_BASE_URL;
  }

  public get zoopApiKey(): string {
    if (!this.ZOOP_API_KEY) {
      throw new InvalidConfigurationError(
        "ZOOP_API_KEY is not defined."
      );
    }

    return this.ZOOP_API_KEY;
  }

  public get zoopMarketPlace(): string {
    if (!this.ZOOP_MARKETPLACE_KEY) {
      throw new InvalidConfigurationError(
        "ZOOP_MARKETPLACE_KEY is not defined."
      );
    }

    return this.ZOOP_MARKETPLACE_KEY;
  }
}
