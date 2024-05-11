import { injectable } from 'tsyringe';
import { listProduct } from './methods/listProduct';
import { postProduct } from './methods/postProduct';
import { updateProductDetailHowToAccess } from './methods/updateProductDetailHowToAccess';
import { deleteProductDetailHowToAccess } from './methods/deleteProductDetailHowToAccess';
import { viewProduct } from './methods/viewProduct';
import { updateProduct } from './methods/updateProduct';
import { createProductImage } from './methods/createProductImage';
import { addProductToGroup } from './methods/addProductToGroup';
import { deleteProductFromGroup } from './methods/deleteProductFromGroup';
import { createProductGroupImage } from './methods/createProductGroupImage';
import { viewGroup } from './methods/viewGroup';
import { updateProductGroup } from './methods/updateProductGroup';
import { listProductGroup } from './methods/listProductGroup';

@injectable()
class ProductController {
  public list = listProduct;
  public view = viewProduct;
  public post = postProduct;
  public updateDetail = updateProductDetailHowToAccess;
  public deleteDetail = deleteProductDetailHowToAccess;
  public update = updateProduct;
  public createImage = createProductImage;
  public viewGroup = viewGroup;
  public listGroup = listProductGroup;
  public putGroup = updateProductGroup;
  public addProductToGroup = addProductToGroup;
  public deleteProductFromGroup = deleteProductFromGroup;
  public createGroupImage = createProductGroupImage;
}

export default ProductController;
