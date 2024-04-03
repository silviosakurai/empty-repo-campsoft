import { injectable } from 'tsyringe';
import { IZoopGatewayService } from '@core/interfaces/services/IZoopGateway.service';
import { createTransactionPix } from './zoop/createTransactionPix';
import { createTransactionFullTicket } from './zoop/createTransactionFullTicket';
import { createTransactionSimpleTicket } from './zoop/createTransactionSimpleTicket';
import { createTransactionCard } from './zoop/createTransactionCard';
import { createTransactionCardId } from './zoop/createTransactionCardId';
import { saveCardToken } from './zoop/saveCardToken';

@injectable()
export class ZoopGatewayService implements IZoopGatewayService {
  saveCardToken = saveCardToken;
  createTransactionPix = createTransactionPix;
  createTransactionFullTicket = createTransactionFullTicket;
  createTransactionSimpleTicket = createTransactionSimpleTicket;
  createTransactionCard = createTransactionCard;
  createTransactionCardId = createTransactionCardId;
}
