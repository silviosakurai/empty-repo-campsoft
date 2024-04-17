import { injectable } from 'tsyringe';
import { listProduct } from './methods/listProduct';
import { postProduct } from './methods/postProduct';
import { updateProductDetailHowToAccess } from './methods/updateProductDetailHowToAccess';
import { deleteProductDetailHowToAccess } from './methods/deleteProductDetailHowToAccess';

@injectable()
class ProductController {
  public list = listProduct;
  public post = postProduct;
  public updateDetail = updateProductDetailHowToAccess;
  public deleteDetail = deleteProductDetailHowToAccess;
}

export default ProductController;
