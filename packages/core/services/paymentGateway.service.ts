import { injectable } from "tsyringe";
import { createTransactionPix } from "./payment/createTransactionPix";
import { createTransactionFullTicket } from "./payment/createTransactionFullTicket";
import { createTransactionSimpleTicket } from "./payment/createTransactionSimpleTicket";
import { createTransactionCard } from "./payment/createTransactionCard";
import { createTransactionCardId } from "./payment/createTransactionCardId";
import { saveCardToken } from "./payment/saveCardToken";

@injectable()
export class PaymentGatewayService {
  constructor() {}

  saveCardToken = saveCardToken;
  createTransactionPix = createTransactionPix;
  createTransactionFullTicket = createTransactionFullTicket;
  createTransactionSimpleTicket = createTransactionSimpleTicket;
  createTransactionCard = createTransactionCard;
  createTransactionCardId = createTransactionCardId;
}
