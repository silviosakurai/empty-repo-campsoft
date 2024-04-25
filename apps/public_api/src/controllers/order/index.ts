import { injectable } from 'tsyringe';
import { listOrder } from './methods/listOrder';
import { listPayment } from './methods/listPayment';
import { cancelOrder } from './methods/cancelOrder';
import { findOrderByNumber } from './methods/findOrderByNumber';
import { createOrder } from './methods/createOrder';
import { paymentByBoleto } from './methods/paymentByBoleto';

@injectable()
class OrderController {
  public list = listOrder;
  public create = createOrder;
  public listPayments = listPayment;
  public findByNumber = findOrderByNumber;
  public cancelOrder = cancelOrder;
  public paymentByBoleto = paymentByBoleto;
}

export default OrderController;
