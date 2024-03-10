import { TfaService } from "@core/services/tfa.service";
import { injectable } from "tsyringe";
import { SendCodeLoginTFARequest } from "@core/useCases/tfa/dtos/SendCodeTFARequest.dto";
import { ITemplateEmail } from "@core/interfaces/repositories/tfa";
import { EmailService } from "@core/services/email.service";
import { replaceTemplate } from "@core/common/functions/replaceTemplate";
import { IReplaceTemplate } from "@core/common/interfaces/IReplaceTemplate";
import { IEmailSendService } from "@core/interfaces/services/IEmail.service";
import { ITokenKeyData } from "@core/common/interfaces/ITokenKeyData";

@injectable()
export class SendEmailTFAUserCase {
  private tfaService: TfaService;
  private emailService: EmailService;

  constructor(tfaService: TfaService, emailService: EmailService) {
    this.tfaService = tfaService;
    this.emailService = emailService;
  }

  async execute({
    tokenKeyData,
    type,
    loginUserTFA,
  }: SendCodeLoginTFARequest): Promise<boolean> {
    try {
      const code = await this.tfaService.generateAndVerifyToken();
      const { template, templateId, subject, sender } =
        await this.getTemplateEmail(tokenKeyData, code);

      const payload = {
        html: template,
        subject: subject,
        to: loginUserTFA.login,
        from: sender,
      } as IEmailSendService;

      const sendEmail = await this.emailService.send(payload);

      if (sendEmail) {
        await this.tfaService.insertEmailHistory(
          templateId,
          loginUserTFA,
          sender,
          sendEmail
        );
      }

      await this.tfaService.insertCodeUser(type, loginUserTFA, code);

      return true;
    } catch (error) {
      throw error;
    }
  }

  async getTemplateEmail(
    tokenKeyData: ITokenKeyData,
    code: string
  ): Promise<ITemplateEmail> {
    const template = await this.tfaService.getTemplateEmail(tokenKeyData);

    template.template = replaceTemplate(template.template, {
      code,
    } as IReplaceTemplate);

    return template;
  }
}
