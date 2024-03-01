import * as dotenv from "dotenv";
import InvalidConfigurationError from "@core/common/exceptions/InvalidConfigurationError";

dotenv.config({
  path: "../../.env",
});

export class WhatsappEnvironment {
  private readonly WHATSAPP_API_SID: string | undefined;
  private readonly WHATSAPP_API_TOKEN: string | undefined;

  constructor() {
    this.WHATSAPP_API_SID = process.env.WHATSAPP_API_SID;
    this.WHATSAPP_API_TOKEN = process.env.WHATSAPP_API_TOKEN;
  }

  public get whatsappApiSid(): string {
    if (!this.WHATSAPP_API_SID) {
      throw new InvalidConfigurationError("WHATSAPP_API_SID is not defined.");
    }

    return this.WHATSAPP_API_SID;
  }

  public get whatsappApiToken(): string {
    if (!this.WHATSAPP_API_TOKEN) {
      throw new InvalidConfigurationError("WHATSAPP_API_TOKEN is not defined.");
    }

    return this.WHATSAPP_API_TOKEN;
  }
}
