import { injectable } from 'tsyringe';
import { listWebhook } from './methods/listWebhook';

@injectable()
class WebsocketController {
  public listWebhook = listWebhook;
}

export default WebsocketController;
