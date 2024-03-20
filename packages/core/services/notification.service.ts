import { injectable } from "tsyringe";
import { SendWhatsAppTFAUserCase } from "@core/useCases/tfa/SendWhatsAppTFA.useCase";
import { SendSmsTFAUserCase } from "@core/useCases/tfa/SendSmsTFA.useCase";
import { SendEmailTFAUserCase } from "@core/useCases/tfa/SendEmailTFA.useCase";
import { SendCodeLoginTFARequest } from "@core/useCases/tfa/dtos/SendCodeTFARequest.dto";
import { TFAType } from "@core/common/enums/models/tfa";
import { phoneNumberValidator } from "@core/common/functions/phoneNumberValidator";
import { TFAVerificationError } from "@core/common/exceptions/TFAVerificationError";
import { phoneNumberValidateNational } from "@core/common/functions/phoneNumberValidateNational";
import { validateEmail } from "@core/common/functions/emailValidate";
import { TFunction } from "i18next";

@injectable()
class NotificationService {
  private sendWhatsAppTFAUserCase: SendWhatsAppTFAUserCase;
  private sendSmsTFAUserCase: SendSmsTFAUserCase;
  private sendEmailTFAUserCase: SendEmailTFAUserCase;

  constructor(
    sendWhatsAppTFAUserCase: SendWhatsAppTFAUserCase,
    sendSmsTFAUserCase: SendSmsTFAUserCase,
    sendEmailTFAUserCase: SendEmailTFAUserCase
  ) {
    this.sendWhatsAppTFAUserCase = sendWhatsAppTFAUserCase;
    this.sendSmsTFAUserCase = sendSmsTFAUserCase;
    this.sendEmailTFAUserCase = sendEmailTFAUserCase;
  }

  public async executeTfa(
    t: TFunction<"translation", undefined>,
    options: SendCodeLoginTFARequest
  ): Promise<boolean> {
    if (options.type === TFAType.WHATSAPP) {
      if (phoneNumberValidator(options.loginUserTFA.login)) {
        throw new TFAVerificationError(t("phone_is_not_valid"));
      }

      return await this.sendWhatsAppTFAUserCase.execute(options);
    }

    if (options.type === TFAType.SMS) {
      if (phoneNumberValidateNational(options.loginUserTFA.login)) {
        throw new TFAVerificationError(t("phone_is_not_valid"));
      }

      return await this.sendSmsTFAUserCase.execute(options);
    }

    if (options.type === TFAType.EMAIL) {
      if (validateEmail(options.loginUserTFA.login)) {
        throw new TFAVerificationError(t("email_is_not_valid"));
      }

      return await this.sendEmailTFAUserCase.execute(options);
    }

    return false;
  }
}

export default NotificationService;
