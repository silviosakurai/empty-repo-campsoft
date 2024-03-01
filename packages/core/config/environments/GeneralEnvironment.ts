import * as dotenv from "dotenv";
import InvalidConfigurationError from "@core/common/exceptions/InvalidConfigurationError";
import { AppEnvironment } from "@core/common/enums/AppEnvironment";

dotenv.config({
  path: "../../.env",
});

export class GeneralEnvironment {
  private readonly APP_ENVIRONMENT: AppEnvironment | undefined;
  private readonly SMS_API_EMAIL: string | undefined;
  private readonly SMS_API_PASSWORD: string | undefined;
  private readonly SMS_API_CENTRAL_CUSTOM_ID: string | undefined;
  private readonly SMS_API_PRODUTO_ID: string | undefined;
  private readonly SMS_API_BASE_URL: string | undefined;
  private readonly SMS_API_AUTH_URL: string | undefined;

  constructor() {
    this.APP_ENVIRONMENT = process.env
      .APP_ENVIRONMENT as unknown as AppEnvironment;

    this.SMS_API_EMAIL = process.env.SMS_API_EMAIL;
    this.SMS_API_PASSWORD = process.env.SMS_API_PASSWORD;
    this.SMS_API_CENTRAL_CUSTOM_ID = process.env.SMS_API_CENTRAL_CUSTOM_ID;
    this.SMS_API_PRODUTO_ID = process.env.SMS_API_PRODUTO_ID;
    this.SMS_API_BASE_URL = process.env.SMS_API_BASE_URL;
    this.SMS_API_AUTH_URL = process.env.SMS_API_AUTH_URL;
  }

  public get appEnvironment(): AppEnvironment {
    if (!this.APP_ENVIRONMENT) {
      throw new InvalidConfigurationError("APP_ENVIRONMENT is not defined.");
    }

    if (
      this.APP_ENVIRONMENT !== AppEnvironment.DEV &&
      this.APP_ENVIRONMENT !== AppEnvironment.HMG &&
      this.APP_ENVIRONMENT !== AppEnvironment.PROD
    ) {
      throw new InvalidConfigurationError("APP_ENVIRONMENT is not valid.");
    }

    return this.APP_ENVIRONMENT;
  }

  public get smsApiEmail(): string {
    if (!this.SMS_API_EMAIL) {
      throw new InvalidConfigurationError("SMS_API_EMAIL is not defined.");
    }

    return this.SMS_API_EMAIL;
  }

  public get smsApiPassword(): string {
    if (!this.SMS_API_PASSWORD) {
      throw new InvalidConfigurationError("SMS_API_PASSWORD is not defined.");
    }
    return this.SMS_API_PASSWORD;
  }

  public get smsApiCentralCustomId(): string {
    if (!this.SMS_API_CENTRAL_CUSTOM_ID) {
      throw new InvalidConfigurationError(
        "SMS_API_CENTRAL_CUSTOM_ID is not defined."
      );
    }
    return this.SMS_API_CENTRAL_CUSTOM_ID;
  }

  public get smsApiProdutoId(): string {
    if (!this.SMS_API_PRODUTO_ID) {
      throw new InvalidConfigurationError("SMS_API_PRODUTO_ID is not defined.");
    }
    return this.SMS_API_PRODUTO_ID;
  }

  public get smsApiBaseUrl(): string {
    if (!this.SMS_API_BASE_URL) {
      throw new InvalidConfigurationError("SMS_API_BASE_URL is not defined.");
    }
    return this.SMS_API_BASE_URL;
  }

  public get smsApiAuthUrl(): string {
    if (!this.SMS_API_AUTH_URL) {
      throw new InvalidConfigurationError("SMS_API_AUTH_URL is not defined.");
    }
    return this.SMS_API_AUTH_URL;
  }
}
