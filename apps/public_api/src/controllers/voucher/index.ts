import { injectable } from 'tsyringe';
import { viewVoucher } from './methods/viewVoucher';

@injectable()
class VoucherController {
  public view = viewVoucher;
}

export default VoucherController;
