import { MessageInstance } from "twilio/lib/rest/api/v2010/account/message";

export type IWhatsappService = {
  send: (input: IWhatsappServiceInput) => Promise<MessageInstance | Error>;
};

export type IWhatsappServiceInput = {
  message: string;
  target_phone: string;
};
