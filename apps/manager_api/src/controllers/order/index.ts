import { injectable } from 'tsyringe';
import { listOrder } from './methods/listOrder';
import { createOrder } from './methods/createOrder';

@injectable()
class OrderController {
  public list = listOrder;
  public create = createOrder;
}

export default OrderController;
