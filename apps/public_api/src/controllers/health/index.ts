import { injectable } from 'tsyringe';
import { viewVoucher } from './methods/viewVoucher';

@injectable()
class HealthController {
  public view = viewVoucher;
}

export default HealthController;
