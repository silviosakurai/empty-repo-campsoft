import { injectable } from 'tsyringe';
import { payment } from './methods/payment';

@injectable()
export class WebsocketController {
  public payment = payment;
}
