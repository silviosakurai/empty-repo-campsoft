import {
  IEmailSendService,
  IEmailService,
} from "@core/interfaces/services/IEmail.service";
import { awsEnvironment } from "@core/config/environments";
import { SESClient, SendEmailCommand } from "@aws-sdk/client-ses";
import { injectable } from "tsyringe";

@injectable()
export class EmailService implements IEmailService {
  private client: SESClient;

  constructor() {
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
}
