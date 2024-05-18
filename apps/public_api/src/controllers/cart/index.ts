import { injectable } from 'tsyringe';
import { createCart } from './methods/createCart';
import { findCartById } from './methods/findCartById';
import { editCart } from './methods/editCart';

@injectable()
class CartController {
  public create = createCart;
  public findCartById = findCartById;
  public editCart = editCart;
}

export default CartController;
