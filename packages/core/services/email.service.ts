import {
  IEmailSendService,
  IEmailService,
} from "@core/interfaces/services/IEmail.service";
import { awsEnvironment } from "@core/config/environments";
import { SESClient, SendEmailCommand } from "@aws-sdk/client-ses";
import { injectable } from "tsyringe";
import { ITokenKeyData } from "@core/common/interfaces/ITokenKeyData";
import { ITemplateEmail } from "@core/interfaces/repositories/tfa";
import { EmailListerRepository } from "@core/repositories/email/EmailLister.repository";
import { TemplateModulo } from "@core/common/enums/TemplateMessage";
import { LoginEmail } from "@core/interfaces/services/IClient.service";
import { replaceTemplate } from "@core/common/functions/replaceTemplate";
import { IReplaceTemplate } from "@core/common/interfaces/IReplaceTemplate";
import { currentTime } from "@core/common/functions/currentTime";

@injectable()
export class EmailService implements IEmailService {
  private client: SESClient;

  constructor(private readonly emailListerRepository: EmailListerRepository) {
    this.client = new SESClient({ region: awsEnvironment.awsRegion });
  }

  private parseEmail(
    html: string,
    subject: string,
    to: string,
    from: string | null
  ) {
    return new SendEmailCommand({
      Destination: {
        ToAddresses: [to],
      },
      Message: {
        Body: {
          Html: {
            Data: html,
          },
        },
        Subject: {
          Data: subject,
        },
      },
      Source: from ?? awsEnvironment.awsSesEmail,
    });
  }

  public send(params: IEmailSendService) {
    const parsedEmail = this.parseEmail(
      params.html,
      params.subject,
      params.to,
      params.from
    );

    return this.client.send(parsedEmail);
  }

  public async getTemplateEmailModule(
    tokenKeyData: ITokenKeyData,
    templateModulo: TemplateModulo
  ): Promise<ITemplateEmail> {
    return this.emailListerRepository.getTemplateEmail(
      tokenKeyData,
      templateModulo
    );
  }

  public async getTemplateEmail(
    tokenKeyData: ITokenKeyData,
    templateModulo: TemplateModulo,
    rTemplate: IReplaceTemplate
  ): Promise<ITemplateEmail> {
    const template = await this.getTemplateEmailModule(
      tokenKeyData,
      templateModulo
    );

    template.template = replaceTemplate(template.template, rTemplate);

    return template;
  }

  public async sendEmail(
    tokenKeyData: ITokenKeyData,
    loginEmail: LoginEmail,
    templateModulo: TemplateModulo,
    rTemplate: IReplaceTemplate
  ): Promise<boolean> {
    const { template, templateId, subject, sender } =
      await this.getTemplateEmail(tokenKeyData, templateModulo, rTemplate);

    const payload = {
      html: template,
      subject: subject,
      to: loginEmail.email,
      from: sender,
    } as IEmailSendService;

    const sendEmail = await this.send(payload);

    const emailToken = sendEmail.MessageId ?? "";
    const sendDate = currentTime();

    if (sendEmail) {
      await this.emailListerRepository.insertEmailHistory(
        templateId,
        loginEmail,
        sender,
        emailToken,
        sendDate
      );

      return true;
    }

    return false;
  }
}
