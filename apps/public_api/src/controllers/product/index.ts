import { injectable } from 'tsyringe';
import { listProduct } from './methods/listProduct';
import { viewProduct } from './methods/viewProduct';

@injectable()
class ProductController {
  public list = listProduct;
  public view = viewProduct;
}

export default ProductController;
