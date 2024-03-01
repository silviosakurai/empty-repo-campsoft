import { DatabaseEnvironment } from "./DatabaseEnvironment";
import { GeneralEnvironment } from "./GeneralEnvironment";
import { SmsEnvironment } from "./SmsEnvinronment";

export const generalEnvironment = new GeneralEnvironment();
export const databaseEnvironment = new DatabaseEnvironment();
export const smsEnvironment = new SmsEnvironment();
