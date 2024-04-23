import { injectable } from "tsyringe";
import { IZoopGatewayService } from "@core/interfaces/services/IZoopGateway.service";
import { createTransactionPix } from "./payment/createTransactionPix";
import { createTransactionFullTicket } from "./payment/createTransactionFullTicket";
import { createTransactionSimpleTicket } from "./payment/createTransactionSimpleTicket";
import { createTransactionCard } from "./payment/createTransactionCard";
import { createTransactionCardId } from "./payment/createTransactionCardId";
import { createCreditCardToken } from "./payment/createCreditCardToken";

@injectable()
export class ZoopGatewayService implements IZoopGatewayService {
  createTransactionPix = createTransactionPix;
  createTransactionFullTicket = createTransactionFullTicket;
  createTransactionSimpleTicket = createTransactionSimpleTicket;
  createTransactionCard = createTransactionCard;
  createTransactionCardId = createTransactionCardId;
  createCreditCardToken = createCreditCardToken;
}
