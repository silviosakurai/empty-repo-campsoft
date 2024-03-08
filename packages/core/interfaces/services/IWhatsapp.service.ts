import { MessageInstance } from "twilio/lib/rest/api/v2010/account/message";

export interface IWhatsappService {
  send: (input: IWhatsappServiceInput) => Promise<MessageInstance | Error>;
}

export interface IWhatsappServiceInput {
  message: string;
  target_phone: string;
  sender_phone?: string | null;
}
