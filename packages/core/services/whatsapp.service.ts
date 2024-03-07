import { InvalidPhoneNumberError } from "@core/common/exceptions/InvalidPhoneNumberError";
import { phoneNumberValidate } from "@core/common/functions/phoneNumberValidate";
import { whatsappEnvironment } from "@core/config/environments";
import {
  IWhatsappService,
  IWhatsappServiceInput,
} from "@core/interfaces/services/IWhatsapp.service";
import { MessageInstance } from "twilio/lib/rest/api/v2010/account/message";

export class WhatsappService implements IWhatsappService {
  async send(input: IWhatsappServiceInput) {
    const client = await this.connection();

    const phonesValidated = this.phonesValidate(input);

    if (phonesValidated) return phonesValidated;

    try {
      const response = await client.messages.create({
        from: `whatsapp:+${input.sender_phone}`,
        body: input.message,
        to: `whatsapp:+${input.target_phone}`,
      });

      return response as MessageInstance;
    } catch (error: any) {
      return new Error(error);
    }
  }

  private phonesValidate({
    sender_phone,
    target_phone,
  }: IWhatsappServiceInput): null | InvalidPhoneNumberError {
    const targetPhoneValidated = phoneNumberValidate(target_phone);
    if (targetPhoneValidated) {
      return new InvalidPhoneNumberError("Target Phone is not valid.");
    }

    const senderPhoneValidated = phoneNumberValidate(sender_phone);
    if (senderPhoneValidated) {
      return new InvalidPhoneNumberError("Sender Phone is not valid.");
    }

    return null;
  }

  private async connection() {
    const accountSid = whatsappEnvironment.whatsappApiSid;
    const authToken = whatsappEnvironment.whatsappApiToken;
    const { Twilio } = await import("twilio");

    const client = new Twilio(accountSid, authToken);

    return client;
  }
}
