import { injectable } from "tsyringe";
import { createTransactionPix } from "./payment/createTransactionPix";
import { createTransactionSimpleTicket } from "./payment/createTransactionSimpleTicket";
import { createTransactionCardId } from "./payment/createTransactionCardId";
import { createCustomer } from "./payment/createCustomer";
import { removeCardById } from "./payment/removeCardById";
import { createCreditCardToken } from "./payment/createCreditCardToken";
import { linkCardTokenWithCustomer } from "./payment/linkCardTokenWithCustomer";

@injectable()
export class PaymentGatewayService {
  createCreditCardToken = createCreditCardToken;
  createCustomer = createCustomer;
  createTransactionCardId = createTransactionCardId;
  createTransactionPix = createTransactionPix;
  createTransactionSimpleTicket = createTransactionSimpleTicket;
  linkCardTokenWithCustomer = linkCardTokenWithCustomer;
  removeCardById = removeCardById;
}
