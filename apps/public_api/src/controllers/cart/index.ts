import { injectable } from 'tsyringe';
import { createCart } from './methods/createCart';

@injectable()
class CartController {
  public create = createCart;
}

export default CartController;
