import { injectable } from 'tsyringe';
import { listProduct } from './methods/listProduct';
import { postProduct } from './methods/postProduct';
import { updateProductDetailHowToAccess } from './methods/updateProductDetailHowToAccess';
import { deleteProductDetailHowToAccess } from './methods/deleteProductDetailHowToAccess';
import { viewProduct } from './methods/viewProduct';
import { updateProduct } from './methods/updateProduct';
import { createProductImage } from './methods/createProductImage';

@injectable()
class ProductController {
  public list = listProduct;
  public view = viewProduct;
  public post = postProduct;
  public updateDetail = updateProductDetailHowToAccess;
  public deleteDetail = deleteProductDetailHowToAccess;
  public update = updateProduct;
  public createImage = createProductImage;
}

export default ProductController;
