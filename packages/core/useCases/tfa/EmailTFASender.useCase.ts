import { TfaService } from "@core/services/tfa.service";
import { injectable } from "tsyringe";
import { SendCodeLoginTFARequest } from "@core/useCases/tfa/dtos/SendCodeTFARequest.dto";
import { EmailService } from "@core/services/email.service";
import { NotificationTemplate } from "@core/interfaces/services/IClient.service";
import { TemplateModulo } from "@core/common/enums/TemplateMessage";
import { IReplaceTemplate } from "@core/common/interfaces/IReplaceTemplate";

@injectable()
export class EmailTFASenderUserCase {
  constructor(
    private readonly tfaService: TfaService,
    private readonly emailService: EmailService
  ) {}

  async execute({
    tokenKeyData,
    type,
    loginUserTFA,
  }: SendCodeLoginTFARequest): Promise<boolean> {
    const code = await this.tfaService.generateAndVerifyToken();

    const notificationTemplate = {
      email: loginUserTFA.login,
      clientId: loginUserTFA.clientId,
    } as NotificationTemplate;

    const replaceTemplate = {
      code,
    } as IReplaceTemplate;

    const isEmailSent = await this.emailService.sendEmail(
      tokenKeyData,
      notificationTemplate,
      TemplateModulo.CODIGO_TFA,
      replaceTemplate
    );

    if (isEmailSent) {
      await this.tfaService.insertCodeUser(type, loginUserTFA, code);
    }

    return isEmailSent;
  }
}
