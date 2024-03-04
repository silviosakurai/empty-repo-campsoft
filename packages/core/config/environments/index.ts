import { DatabaseEnvironment } from "./DatabaseEnvironment";
import { GeneralEnvironment } from "./GeneralEnvironment";
import { WhatsappEnvironment } from "./WhatsappEnvironment";

export const generalEnvironment = new GeneralEnvironment();
export const databaseEnvironment = new DatabaseEnvironment();
export const whatsappEnvironment = new WhatsappEnvironment();
