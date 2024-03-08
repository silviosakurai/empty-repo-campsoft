import { SendEmailCommandOutput } from "@aws-sdk/client-ses";

export type IEmailService = {
  send: (html: string, to: string, subject: string) => Promise<SendEmailCommandOutput>
};
