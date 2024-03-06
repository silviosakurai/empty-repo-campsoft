import { IEmailService } from "@core/interfaces/services/IEmail.service";
import { awsEnvironment } from "@core/config/environments";
import { SESClient, SendEmailCommand } from "@aws-sdk/client-ses";
import { injectable } from "tsyringe";

@injectable()
export class EmailService implements IEmailService {
  private client: SESClient;

  constructor() {
    this.client = new SESClient({ region: awsEnvironment.awsRegion });
  }

  private parseEmail(html: string, to: string, subject: string) {
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
      Source: awsEnvironment.awsSesEmail,
    });
  }

  public send(html: string, to: string, subject: string) {
    const parsedEmail = this.parseEmail(html, to, subject);
    return this.client.send(parsedEmail);
  }
}
