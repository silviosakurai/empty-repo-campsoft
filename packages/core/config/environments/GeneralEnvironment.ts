import * as dotenv from "dotenv";
import InvalidConfigurationError from "@core/common/exceptions/InvalidConfigurationError";
import { AppEnvironment } from "@core/common/enums/AppEnvironment";

dotenv.config({
  path: "../../.env",
});

export class GeneralEnvironment {
  private readonly APP_ENVIRONMENT: AppEnvironment | undefined;
  private readonly WHATSAPP_API_SID: string | undefined;
  private readonly WHATSAPP_API_SECRET: string | undefined;
  private readonly WHATSAPP_API_TOKEN: string | undefined;

  constructor() {
    this.APP_ENVIRONMENT = process.env
      .APP_ENVIRONMENT as unknown as AppEnvironment;

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
