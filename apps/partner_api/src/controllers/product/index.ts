import { injectable } from 'tsyringe';
import { listProduct } from './methods/listProduct';

@injectable()
class ProductController {
  public list = listProduct;
}

export default ProductController;
