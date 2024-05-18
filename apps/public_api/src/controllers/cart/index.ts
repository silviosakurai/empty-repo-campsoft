import { injectable } from 'tsyringe';
import { createCart } from './methods/createCart';
import { findCartById } from './methods/findCartById';

@injectable()
class CartController {
  public create = createCart;
  public findCartById = findCartById;
}

export default CartController;
