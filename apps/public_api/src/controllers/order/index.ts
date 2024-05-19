import { injectable } from 'tsyringe';
import { listOrder } from './methods/listOrder';
import { listPayment } from './methods/listPayment';
import { cancelOrder } from './methods/cancelOrder';
import { findOrderByNumber } from './methods/findOrderByNumber';
import { createOrder } from './methods/createOrder';
import { paymentByBoleto } from './methods/paymentByBoleto';
import { paymentByCreditCard } from './methods/paymentByCreditCard';
import { paymentByPix } from './methods/paymentByPix';
import { viewPaymentHistoric } from './methods/viewPaymentHistoric';
import { voucherOrder } from './methods/voucherOrder';

@injectable()
class OrderController {
  public list = listOrder;
  public create = createOrder;
  public listPayments = listPayment;
  public findByNumber = findOrderByNumber;
  public cancelOrder = cancelOrder;
  public paymentByBoleto = paymentByBoleto;
  public paymentByCreditCard = paymentByCreditCard;
  public paymentByPix = paymentByPix;
  public viewPaymentHistoric = viewPaymentHistoric;
  public voucherOrder = voucherOrder;
}

export default OrderController;
