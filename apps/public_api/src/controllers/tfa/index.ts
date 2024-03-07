import { injectable } from 'tsyringe';
import { sendCode } from '@/controllers/tfa/methods/sendCode';

@injectable()
class TfaController {
  public sendCode = sendCode;
}

export default TfaController;
