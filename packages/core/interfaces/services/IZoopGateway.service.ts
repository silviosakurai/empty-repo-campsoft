import { ResponseService } from "@core/common/interfaces/IResponseServices";
import {
  ITransactionFullTicketRequest,
  ITransactionFullTicketResponse,
} from "./payment/ITransactionFullTicket";
import {
  ITransactionSimpleTicketRequest,
  ITransactionSimpleTicketResponse,
} from "./payment/ITransactionSimpleTicket";
import {
  ITransactionPixRequest,
  ITransactionPixResponse,
} from "./payment/ITransactionPix";
import {
  ITransactionCardIdRequest,
  ITransactionCardRequest,
  ITransactionCardResponse,
} from "./payment/ITransactionCard";

export interface IZoopGatewayService {
  createTransactionPix: (
    input: ITransactionPixRequest
  ) => Promise<ResponseService<ITransactionPixResponse>>;
  createTransactionFullTicket: (
    input: ITransactionFullTicketRequest
  ) => Promise<ResponseService<ITransactionFullTicketResponse>>;
  createTransactionSimpleTicket: (
    input: ITransactionSimpleTicketRequest
  ) => Promise<ResponseService<ITransactionSimpleTicketResponse>>;
  createTransactionCard: (
    input: ITransactionCardRequest
  ) => Promise<ResponseService<ITransactionCardResponse>>;
  createTransactionCardId: (
    input: ITransactionCardIdRequest
  ) => Promise<ResponseService<ITransactionCardResponse>>;
}
