import { EmailTemplateModuleNotFoundError } from "@core/common/exceptions/EmailTemplateModuleNotFoundError";
import { ClientService, EmailService } from "@core/services";
import { TemplateService } from "@core/services/template.service";
import { injectable } from "tsyringe";

@injectable()
export class ClientEmailNewsletterCreatorUseCase {
  constructor(
    private readonly emailService: EmailService,
    private readonly clientService: ClientService,
    private readonly templateService: TemplateService
  ) {}

  async create(clientId: string, email: string, companyId?: number) {
    const client = await this.clientService.clientEmailViewByEmail(email);

    if (client?.some((item) => item.hasNewsletter)) {
      return null;
    }

    if (!client?.[0].token) {
      await this.clientService.createEmail({
        clientId,
        email,
        emailType: 1,
      });

      const emailCreated =
        await this.clientService.clientEmailViewByEmail(email);

      await this.sendEmail(email, emailCreated?.[0].token as string, companyId);
    }

    await this.clientService.createEmailNewsletter(clientId, 2);

    return true;
  }

  private async sendEmail(email: string, token: string, companyId?: number) {
    const emailTemplateModule =
      await this.templateService.viewModuleByName("ativacao_email");

    if (!emailTemplateModule) {
      throw new EmailTemplateModuleNotFoundError(
        "EmailTemplateModuleNotFoundError"
      );
    }

    const companyEmailTemplate = await this.templateService.viewTemplateEmail(
      emailTemplateModule[0].id,
      companyId
    );

    if (companyEmailTemplate.length) {
      return await this.emailService.send({
        to: email,
        from: companyEmailTemplate[0].fromEmail,
        html: companyEmailTemplate[0].html ?? "",
        subject: companyEmailTemplate[0].subject,
      });
    }

    const emailTemplate = await this.templateService.viewTemplateEmail(
      emailTemplateModule[0].id
    );

    return await this.emailService.send({
      to: email,
      from: emailTemplate[0].fromEmail,
      html: emailTemplate[0].html ?? "",
      subject: emailTemplate[0].subject,
    });
  }
}
