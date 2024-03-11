import { InvalidPhoneNumberError } from "@core/common/exceptions/InvalidPhoneNumberError";
import { PhoneNumberValidator } from "@core/common/functions/PhoneNumberValidator";
import { phoneNumberIncludesCountryCode } from "@core/common/functions/phoneNumberIncludesCountryCode";
import { whatsappEnvironment } from "@core/config/environments";
import {
  IWhatsappService,
  IWhatsappServiceInput,
} from "@core/interfaces/services/IWhatsapp.service";
import { injectable } from "tsyringe";
import { MessageInstance } from "twilio/lib/rest/api/v2010/account/message";

@injectable()
export class WhatsappService implements IWhatsappService {
  constructor(private readonly phoneNumberValidator: PhoneNumberValidator) {}

  async send(input: IWhatsappServiceInput): Promise<MessageInstance> {
    const client = await this.connection();

    try {
      this.phonesValidate(input);

      const sendPhone = this.sendPhone(input.sender_phone);
      const targetPhone = phoneNumberIncludesCountryCode(input.target_phone);

      const response = await client.messages.create({
        from: `whatsapp:${sendPhone}`,
        body: input.message,
        to: `whatsapp:${targetPhone}`,
      });

      return response as MessageInstance;
    } catch (error: unknown) {
      throw new Error(error as string);
    }
  }

  private phonesValidate({
    sender_phone,
    target_phone,
  }: IWhatsappServiceInput): null | InvalidPhoneNumberError {
    const targetPhone = phoneNumberIncludesCountryCode(target_phone);

    const targetPhoneValidated =
      this.phoneNumberValidator.validate(targetPhone);

    if (targetPhoneValidated) {
      throw new InvalidPhoneNumberError("Target Phone is not valid.");
    }

    const sendPhone = this.sendPhone(sender_phone);

    const senderPhoneValidated = this.phoneNumberValidator.validate(sendPhone);
    if (senderPhoneValidated) {
      throw new InvalidPhoneNumberError("Sender Phone is not valid.");
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

  private sendPhone(sendPhone: string | null | undefined): string {
    const phoneNumber = sendPhone ?? whatsappEnvironment.whatsappApiNumber;

    return phoneNumberIncludesCountryCode(phoneNumber);
  }
}
