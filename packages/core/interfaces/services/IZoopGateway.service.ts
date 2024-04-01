import { ResponseService } from "@core/common/interfaces/IResponseServices";
import {
  ITransactionFullTicketRequest,
  ITransactionFullTicketResponse,
} from "./zoop/ITransactionFullTicket";
import {
  ITransactionSimpleTicketRequest,
  ITransactionSimpleTicketResponse,
} from "./zoop/ITransactionSimpleTicket";
import {
  ITransactionPixRequest,
  ITransactionPixResponse,
} from "./zoop/ITransactionPix";
import {
  ITransactionCardIdRequest,
  ITransactionCardRequest,
  ITransactionCardResponse,
} from "./zoop/ITransactionCard";
import {
  ISaveCardTokenRequest,
  ISaveCardTokenResponse,
} from "./zoop/ISaveCardToken";

export interface IZoopGatewayService {
  saveCardToken: (
    input: ISaveCardTokenRequest
  ) => Promise<ResponseService<ISaveCardTokenResponse>>;
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
