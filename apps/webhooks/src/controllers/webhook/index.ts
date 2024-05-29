import { injectable } from 'tsyringe';
import { paymentWebhook } from './methods/paymentWebhook';

@injectable()
class WebhookController {
  public paymentWebhook = paymentWebhook;
}
export default WebhookController;
