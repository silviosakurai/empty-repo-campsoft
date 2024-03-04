import { DatabaseEnvironment } from "./DatabaseEnvironment";
import { GeneralEnvironment } from "./GeneralEnvironment";
import { SmsEnvironment } from "./SmsEnvinronment";
import { WhatsappEnvironment } from "./WhatsappEnvironment";

export const generalEnvironment = new GeneralEnvironment();
export const databaseEnvironment = new DatabaseEnvironment();
export const smsEnvironment = new SmsEnvironment();
export const whatsappEnvironment = new WhatsappEnvironment();