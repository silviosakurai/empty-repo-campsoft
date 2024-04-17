import { injectable } from 'tsyringe';
import { listProduct } from './methods/listProduct';
import { postProduct } from './methods/postProduct';
import { updateProductDetailHowToAccess } from './methods/updateProductDetailHowToAccess';

@injectable()
class ProductController {
  public list = listProduct;
  public post = postProduct;
  public updateDetail = updateProductDetailHowToAccess;
}

export default ProductController;
