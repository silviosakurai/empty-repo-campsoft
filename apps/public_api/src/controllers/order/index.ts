import { injectable } from 'tsyringe';
import { listOrder } from './methods/listOrder';
import { listPayment } from './methods/listPayment';
import { cancelOrder } from './methods/cancelOrder';
import { findOrderByNumber } from './methods/findOrderByNumber';

@injectable()
class OrderController {
  public list = listOrder;
  public listPayments = listPayment;
  public findByNumber = findOrderByNumber;
  public cancelOrder = cancelOrder;
}

export default OrderController;
