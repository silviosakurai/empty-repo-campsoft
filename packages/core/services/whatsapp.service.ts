import { phoneNumberIncludesCountryCode } from "@core/common/functions/phoneNumberIncludesCountryCode";
import { whatsappEnvironment } from "@core/config/environments";
import {
  IWhatsappService,
  IWhatsappServiceInput,
} from "@core/interfaces/services/IWhatsapp.service";
import { injectable } from "tsyringe";
import { MessageInstance } from "twilio/lib/rest/api/v2010/account/message";
import { LoggerService } from "@core/services/logger.service";

@injectable()
export class WhatsappService implements IWhatsappService {
  constructor(private readonly logger: LoggerService) {}

  async send(input: IWhatsappServiceInput): Promise<MessageInstance> {
    const client = await this.connection();

    try {
      const sendPhone = this.sendPhone(input.sender_phone);
      const targetPhone = phoneNumberIncludesCountryCode(input.target_phone);

      const response = await client.messages.create({
        from: `whatsapp:${sendPhone}`,
        body: input.message,
        to: `whatsapp:${targetPhone}`,
      });

      return response as MessageInstance;
    } catch (error: unknown) {
      this.logger.error(error);

      throw error;
    }
  }

  private async connection() {
    const accountSid = whatsappEnvironment.whatsappApiSid;
    const authToken = whatsappEnvironment.whatsappApiToken;
    const { Twilio } = await import("twilio");

    const client = new Twilio(accountSid, authToken);

    return client;
  }

  private sendPhone(sendPhone: string | null | undefined): string {
    const phoneNumber = sendPhone ?? whatsappEnvironment.whatsappApiNumber;

    return phoneNumberIncludesCountryCode(phoneNumber);
  }
}
