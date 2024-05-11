import { ICreateCreditCardTokenResponse } from "@core/interfaces/services/payment/ICreateCreditCardToken";

export type ClientCardCreateRequest = ICreateCreditCardTokenResponse & {
  default: boolean;
};
