import { injectable } from 'tsyringe';
import { sendCode } from '@/controllers/tfa/methods/sendCode';
import { validateCode } from '@/controllers/tfa/methods/validateCode';

@injectable()
class TfaController {
  public sendCode = sendCode;
  public validateCode = validateCode;
}

export default TfaController;
