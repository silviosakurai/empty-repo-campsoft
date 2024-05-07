import * as dotenv from "dotenv";
import InvalidConfigurationError from "@core/common/exceptions/InvalidConfigurationError";
import { AppEnvironment } from "@core/common/enums/AppEnvironment";

dotenv.config({
  path: "../../.env",
});

export class GeneralEnvironment {
  private readonly APP_ENVIRONMENT: AppEnvironment | undefined;
  private readonly APP_URL_PUBLIC: string | undefined;
  private readonly APP_URL_MANAGER: string | undefined;
  private readonly APP_URL_TOOLS: string | undefined;
  private readonly APP_URL_WEBSOCKET: string | undefined;
  private readonly JWT_SECRET: string | undefined;
  private readonly JWT_SECRET_EXPIRES_IN: string | undefined;
  private readonly BASE_URL_CAMPSOFT_API: string | undefined;
  private readonly API_KEY_CAMPSOFT: string | undefined;
  private readonly PAYMENT_API_BASE_URL: string | undefined;
  private readonly PAYMENT_API_KEY: string | undefined;
  private readonly PAYMENT_MARKETPLACE_KEY: string | undefined;

  constructor() {
    this.APP_ENVIRONMENT = process.env
      .APP_ENVIRONMENT as unknown as AppEnvironment;
    this.APP_URL_PUBLIC = process.env.APP_URL_PUBLIC;
    this.APP_URL_MANAGER = process.env.APP_URL_MANAGER;
    this.APP_URL_TOOLS = process.env.APP_URL_TOOLS;
    this.APP_URL_WEBSOCKET = process.env.APP_URL_WEBSOCKET;
    this.JWT_SECRET = process.env.JWT_SECRET;
    this.JWT_SECRET_EXPIRES_IN = process.env.JWT_SECRET_EXPIRES_IN;
    this.API_KEY_CAMPSOFT = process.env.API_KEY_CAMPSOFT;
    this.BASE_URL_CAMPSOFT_API = process.env.BASE_URL_CAMPSOFT_API;
    this.PAYMENT_API_BASE_URL = process.env.PAYMENT_API_BASE_URL;
    this.PAYMENT_API_KEY = process.env.PAYMENT_API_KEY;
    this.PAYMENT_MARKETPLACE_KEY = process.env.PAYMENT_MARKETPLACE_KEY;
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

  public get appUrlManager(): string {
    if (!this.APP_URL_MANAGER) {
      throw new InvalidConfigurationError("APP_URL_MANAGER is not defined.");
    }

    return this.APP_URL_MANAGER;
  }

  public get appUrlTools(): string {
    if (!this.APP_URL_TOOLS) {
      throw new InvalidConfigurationError("APP_URL_TOOLS is not defined.");
    }

    return this.APP_URL_TOOLS;
  }

  public get appUrlWebsocket(): string {
    if (!this.APP_URL_WEBSOCKET) {
      throw new InvalidConfigurationError("APP_URL_WEBSOCKET is not defined.");
    }

    return this.APP_URL_WEBSOCKET;
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

  public get paymentApiBaseUrl(): string {
    if (!this.PAYMENT_API_BASE_URL) {
      throw new InvalidConfigurationError(
        "PAYMENT_API_BASE_URL is not defined."
      );
    }

    return this.PAYMENT_API_BASE_URL;
  }

  public get paymentApiKey(): string {
    if (!this.PAYMENT_API_KEY) {
      throw new InvalidConfigurationError("PAYMENT_API_KEY is not defined.");
    }

    return this.PAYMENT_API_KEY;
  }

  public get paymentMarketPlace(): string {
    if (!this.PAYMENT_MARKETPLACE_KEY) {
      throw new InvalidConfigurationError(
        "PAYMENT_MARKETPLACE_KEY is not defined."
      );
    }

    return this.PAYMENT_MARKETPLACE_KEY;
  }

  public get protocol(): string {
    return this.appEnvironment === AppEnvironment.LOCAL ? "http" : "https";
  }
}
