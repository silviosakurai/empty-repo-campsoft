import { injectable } from 'tsyringe';
import { listProduct } from './methods/listProduct';
import { postProduct } from './methods/postProduct';

@injectable()
class ProductController {
  public list = listProduct;
  public post = postProduct;
}

export default ProductController;
