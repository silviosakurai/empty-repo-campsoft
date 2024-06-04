import { injectable } from 'tsyringe';
import { handleQueue } from './methods/handleQueues';
import { handlePaymentRecurrenceDlq } from './methods/handlePaymentRecurrenceDlq';

@injectable()
export class SchedulersController {
  public handleQueue = handleQueue;
  public handlePaymentRecurrenceDlq = handlePaymentRecurrenceDlq;
}
