import { injectable } from 'tsyringe';
import { listOrder } from './methods/listOrder'

@injectable()
class OrderController {
  public list = listOrder;
}

export default OrderController;
