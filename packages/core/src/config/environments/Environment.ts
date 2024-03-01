import dotenv from "dotenv";
import { AppEnvironment } from "@core/common/enums/AppEnvironment";
import InvalidConfigurationError from "@core/common/exceptions/InvalidConfigurationError";

dotenv.config({
  path: "../../.env",
});

class Environment {
  private readonly APP_ENVIRONMENT: AppEnvironment | undefined;
  private readonly DB_HOST: string | undefined;
  private readonly DB_PORT: number | undefined;
  private readonly DB_USER: string | undefined;
  private readonly DB_PASSWORD: string | undefined;
  private readonly DB_DATABASE: string | undefined;
  private readonly WHATSAPP_API_SID: string | undefined;
  private readonly WHATSAPP_API_SECRET: string | undefined;
  private readonly WHATSAPP_API_TOKEN: string | undefined;

  constructor() {
    this.APP_ENVIRONMENT = process.env
      .APP_ENVIRONMENT as unknown as AppEnvironment;
    this.DB_HOST = process.env.DB_HOST;
    this.DB_PORT = Number(process.env.DB_PORT);
    this.DB_USER = process.env.DB_USER;
    this.DB_PASSWORD = process.env.DB_PASSWORD;
    this.DB_DATABASE = process.env.DB_DATABASE;

    this.WHATSAPP_API_SID = process.env.WHATSAPP_API_SID;
    this.WHATSAPP_API_SECRET = process.env.WHATSAPP_API_SECRET;
    this.WHATSAPP_API_TOKEN = process.env.WHATSAPP_API_TOKEN;
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

  public get dbHost(): string {
    if (!this.DB_HOST) {
      throw new InvalidConfigurationError("DB_HOST is not defined.");
    }

    return this.DB_HOST;
  }

  public get dbPort(): number {
    if (!this.DB_PORT) {
      throw new InvalidConfigurationError("DB_PORT is not defined.");
    }

    return this.DB_PORT;
  }

  public get dbUser(): string {
    if (!this.DB_USER) {
      throw new InvalidConfigurationError("DB_USER is not defined.");
    }

    return this.DB_USER;
  }

  public get dbPassword(): string {
    if (!this.DB_PASSWORD) {
      throw new InvalidConfigurationError("DB_PASSWORD is not defined.");
    }

    return this.DB_PASSWORD;
  }

  public get dbDatabase(): string {
    if (!this.DB_DATABASE) {
      throw new InvalidConfigurationError("DB_DATABASE is not defined.");
    }

    return this.DB_DATABASE;
  }

  public get whatsappApiSid(): string {
    if (!this.WHATSAPP_API_SID) {
      throw new InvalidConfigurationError("WHATSAPP_API_SID is not defined.");
    }

    return this.WHATSAPP_API_SID;
  }

  public get whatsappApiSecret(): string {
    if (!this.WHATSAPP_API_SECRET) {
      throw new InvalidConfigurationError(
        "WHATSAPP_API_SECRET is not defined."
      );
    }

    return this.WHATSAPP_API_SECRET;
  }

  public get whatsappApiToken(): string {
    if (!this.WHATSAPP_API_TOKEN) {
      throw new InvalidConfigurationError("WHATSAPP_API_TOKEN is not defined.");
    }

    return this.WHATSAPP_API_TOKEN;
  }
}

export const environment = new Environment();
