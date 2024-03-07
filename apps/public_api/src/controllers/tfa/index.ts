import { injectable } from 'tsyringe';
import { sendWhatsApp } from '@/controllers/tfa/methods/sendWhatsApp';

@injectable()
class TfaController {
  public sendWhatsApp = sendWhatsApp;
}

export default TfaController;
