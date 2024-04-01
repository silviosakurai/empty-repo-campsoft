import { injectable } from "tsyringe";
import { WhatsAppTFASenderUserCase } from "@core/useCases/tfa/WhatsAppTFASender.useCase";
import { SmsTFAUserSenderCase } from "@core/useCases/tfa/SmsTFASender.useCase";
import { EmailTFASenderUserCase } from "@core/useCases/tfa/EmailTFASender.useCase";
import { SendCodeLoginTFARequest } from "@core/useCases/tfa/dtos/SendCodeTFARequest.dto";
import { TFAType } from "@core/common/enums/models/tfa";
import { phoneNumberValidator } from "@core/common/functions/phoneNumberValidator";
import { TFAVerificationError } from "@core/common/exceptions/TFAVerificationError";
import { phoneNumberValidateNational } from "@core/common/functions/phoneNumberValidateNational";
import { validateEmail } from "@core/common/functions/emailValidate";
import { TFunction } from "i18next";

@injectable()
class NotificationService {
  constructor(
    private readonly whatsAppTFASenderUseCase: WhatsAppTFASenderUserCase,
    private readonly smsTFASenderUseCase: SmsTFAUserSenderCase,
    private readonly emailTFASenderUseCase: EmailTFASenderUserCase
  ) {}

  public async executeTfa(
    t: TFunction<"translation", undefined>,
    options: SendCodeLoginTFARequest
  ): Promise<boolean> {
    if (options.type === TFAType.WHATSAPP) {
      if (phoneNumberValidator(options.loginUserTFA.login)) {
        throw new TFAVerificationError(t("phone_is_not_valid"));
      }

      return await this.whatsAppTFASenderUseCase.execute(options);
    }

    if (options.type === TFAType.SMS) {
      if (phoneNumberValidateNational(options.loginUserTFA.login)) {
        throw new TFAVerificationError(t("phone_is_not_valid"));
      }

      return await this.smsTFASenderUseCase.execute(options);
    }

    if (options.type === TFAType.EMAIL) {
      if (validateEmail(options.loginUserTFA.login)) {
        throw new TFAVerificationError(t("email_is_not_valid"));
      }

      return await this.emailTFASenderUseCase.execute(options);
    }

    return false;
  }
}

export default NotificationService;
