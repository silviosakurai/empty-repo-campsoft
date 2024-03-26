import { injectable } from 'tsyringe';
import { listOrder } from './methods/listOrder';
import { findOrderByNumber } from './methods/findOrderByNumber';

@injectable()
class OrderController {
  public list = listOrder;
  public findByNumber = findOrderByNumber;
}

export default OrderController;
