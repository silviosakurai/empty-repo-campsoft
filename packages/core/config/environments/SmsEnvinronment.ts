import * as dotenv from "dotenv";
import InvalidConfigurationError from "@core/common/exceptions/InvalidConfigurationError";

dotenv.config({
  path: "../../.env",
});

export class SmsEnvironment {
  private readonly SMS_API_EMAIL: string | undefined;
  private readonly SMS_API_PASSWORD: string | undefined;
  private readonly SMS_API_CENTRAL_CUSTOM_ID: string | undefined;
  private readonly SMS_API_PRODUTO_ID: string | undefined;
  private readonly SMS_API_BASE_URL: string | undefined;
  private readonly SMS_API_AUTH_URL: string | undefined;

  constructor() {
    this.SMS_API_EMAIL = process.env.SMS_API_EMAIL;
    this.SMS_API_PASSWORD = process.env.SMS_API_PASSWORD;
    this.SMS_API_CENTRAL_CUSTOM_ID = process.env.SMS_API_CENTRAL_CUSTOM_ID;
    this.SMS_API_PRODUTO_ID = process.env.SMS_API_PRODUTO_ID;
    this.SMS_API_BASE_URL = process.env.SMS_API_BASE_URL;
    this.SMS_API_AUTH_URL = process.env.SMS_API_AUTH_URL;
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
