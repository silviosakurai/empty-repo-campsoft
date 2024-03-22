import { injectable } from 'tsyringe';
import { findOrderByNumber } from './methods/findOrderByNumber';

@injectable()
class OrderController {
  public readByNumber = findOrderByNumber;
}
export default OrderController;
