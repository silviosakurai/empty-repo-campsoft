import { environment } from "@core/config/environments";
import {
  IWhatsappService,
  IWhatsappServiceInput,
} from "@core/interfaces/services/IWhatsapp.service";

export class WhatsappService implements IWhatsappService {
  async send(input: IWhatsappServiceInput) {
    const client = await this.connection();

    try {
      const response = await client.messages.create({
        body: input.message,
        to: `whatsapp:+${input.target_phone}`,
      });

      return response;
    } catch (error: any) {
      return new Error(error);
    }
  }

  private async connection() {
    const accountSid = environment.whatsappApiSid;
    const authToken = environment.whatsappApiToken;
    const { Twilio } = await import("twilio");

    const client = new Twilio(accountSid, authToken);

    return client;
  }
}
