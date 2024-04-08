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

  async create(clientId: string, email: string) {
    const client = await this.clientService.clientEmailViewByEmail(email);

    if (client?.some((item) => item.hasNewsletter)) {
      return null;
    }

    if (!client || !client[0].token) {
      await this.clientService.createEmail({
        clientId,
        email,
        emailType: 1,
      });

      const response = await this.sendEmail(email);
      console.log(response);
    }

    await this.clientService.createEmailNewsletter(clientId, 2);

    return true;
  }

  private async sendEmail(email: string, companyId?: number) {
    const emailTemplate = await this.templateService.viewTemplateEmail(
      9,
      companyId
    );

    await this.emailService.send({
      to: email,
      from: emailTemplate[0].fromEmail,
      html: emailTemplate[0].html ?? "",
      subject: emailTemplate[0].subject,
    });
  }
}
