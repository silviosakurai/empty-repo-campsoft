import { injectable } from "tsyringe";
import { createTransactionPix } from "./payment/createTransactionPix";
import { createTransactionFullTicket } from "./payment/createTransactionFullTicket";
import { createTransactionSimpleTicket } from "./payment/createTransactionSimpleTicket";
import { createTransactionCard } from "./payment/createTransactionCard";
import { createTransactionCardId } from "./payment/createTransactionCardId";
import { createCustomer } from "./payment/createCustomer";

@injectable()
export class PaymentGatewayService {
  createTransactionPix = createTransactionPix;
  createTransactionFullTicket = createTransactionFullTicket;
  createTransactionSimpleTicket = createTransactionSimpleTicket;
  createTransactionCard = createTransactionCard;
  createTransactionCardId = createTransactionCardId;
  createCustomer = createCustomer;
}
