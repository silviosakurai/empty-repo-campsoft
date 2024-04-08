import { SendEmailCommandOutput } from "@aws-sdk/client-ses";

export interface IEmailSendService {
  html: string;
  subject: string;
  to: string;
  from: string | null;
}

export interface IEmailService {
  send: (params: IEmailSendService) => Promise<SendEmailCommandOutput>;
}
