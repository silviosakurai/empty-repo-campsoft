import { TfaService } from "@core/services/tfa.service";
import { injectable } from "tsyringe";
import { SendCodeTFARequest } from "@core/useCases/tfa/dtos/SendCodeTFARequest.dto";
import { ViewApiResponse } from "@core/useCases/api/dtos/ViewApiResponse.dto";
import { ITemplateEmail } from "@core/interfaces/repositories/tfa";
import { EmailService } from "@core/services/email.service";
import { replaceTemplate } from "@core/common/functions/replaceTemplate";
import { IReplaceTemplate } from "@core/common/interfaces/IReplaceTemplate";
import { IEmailSendService } from "@core/interfaces/services/IEmail.service";

@injectable()
export class SendEmailTFAUserCase {
  private tfaService: TfaService;
  private emailService: EmailService;

  constructor(tfaService: TfaService, emailService: EmailService) {
    this.tfaService = tfaService;
    this.emailService = emailService;
  }

  async execute({
    apiAccess,
    type,
    login,
  }: SendCodeTFARequest): Promise<boolean> {
    try {
      const code = await this.tfaService.generateAndVerifyToken();
      const { template, templateId, subject, sender } =
        await this.getTemplateEmail(apiAccess, code);

      const payload = {
        html: template,
        subject: subject,
        to: login,
        from: sender,
      } as IEmailSendService;

      const sendEmail = await this.emailService.send(payload);

      if (sendEmail) {
        await this.tfaService.insertEmailHistory(
          templateId,
          login,
          sender,
          sendEmail
        );
      }

      await this.tfaService.insertCodeUser(type, login, code);

      return true;
    } catch (error) {
      throw error;
    }
  }

  async getTemplateEmail(
    apiAccess: ViewApiResponse,
    code: string
  ): Promise<ITemplateEmail> {
    const template = await this.tfaService.getTemplateEmail(apiAccess);

    template.template = replaceTemplate(template.template, {
      code,
    } as IReplaceTemplate);

    return template;
  }
}
