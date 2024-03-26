import { injectable } from 'tsyringe';
import { listOrder } from './methods/listOrder';
import { listPayment } from './methods/listPayment';

@injectable()
class OrderController {
  public list = listOrder;
  public listPayments = listPayment;
}

export default OrderController;
