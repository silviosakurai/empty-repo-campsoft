import { InvalidPhoneNumberError } from "@core/common/exceptions/InvalidPhoneNumberError";
import { phoneNumberIncludesCountryCode } from "@core/common/functions/phoneNumberIncludesCountryCode";
import { whatsappEnvironment } from "@core/config/environments";
import {
  IWhatsappService,
  IWhatsappServiceInput,
} from "@core/interfaces/services/IWhatsapp.service";
import { injectable } from "tsyringe";
import { MessageInstance } from "twilio/lib/rest/api/v2010/account/message";
import { LoggerService } from "@core/services/logger.service";
import { phoneNumberValidator } from "@core/common/functions/phoneNumberValidator";

@injectable()
export class WhatsappService implements IWhatsappService {
  private logger: LoggerService;

  constructor(logger: LoggerService) {
    this.logger = logger;
  }

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
      this.logger.error(error);

      throw error;
    }
  }

  private phonesValidate({
    sender_phone,
    target_phone,
  }: IWhatsappServiceInput): null | InvalidPhoneNumberError {
    const targetPhone = phoneNumberIncludesCountryCode(target_phone);

    const targetPhoneValidated = phoneNumberValidator(targetPhone);

    if (targetPhoneValidated) {
      this.logger.warn({
        message: "Target Phone is not valid.",
        target_phone,
      });

      throw new InvalidPhoneNumberError("Target Phone is not valid.");
    }

    const sendPhone = this.sendPhone(sender_phone);

    const senderPhoneValidated = phoneNumberValidator(sendPhone);
    if (senderPhoneValidated) {
      this.logger.warn({
        message: "Sender Phone is not valid.",
        sender_phone,
      });

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
