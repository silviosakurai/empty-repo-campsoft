import { injectable } from 'tsyringe';
import { listProduct } from './methods/listProduct';
import { viewProduct } from './methods/viewProduct';
import { listCrossSellProduct } from './methods/listCrossSellProduct';

@injectable()
class ProductController {
  public list = listProduct;
  public view = viewProduct;
  public listCrossSell = listCrossSellProduct;
}

export default ProductController;
