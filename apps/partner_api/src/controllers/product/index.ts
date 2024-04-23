import { injectable } from 'tsyringe';
import { listProduct } from './methods/listProduct';
import { postProduct } from './methods/postProduct';
import { viewProduct } from './methods/viewProduct';
import { updateProduct } from './methods/updateProduct';
import { createProductImage } from './methods/createProductImage';
import { addProductToGroup } from './methods/addProductToGroup';
import { deleteProductFromGroup } from './methods/deleteProductFromGroup';
import { createProductGroupImage } from './methods/createProductGroupImage';
import { viewGroup } from './methods/viewGroup';
import { updateProductGroup } from './methods/updateProductGroup';

@injectable()
class ProductController {
  public list = listProduct;
  public view = viewProduct;
  public post = postProduct;
  public update = updateProduct;
  public createImage = createProductImage;
  public viewGroup = viewGroup;
  public putGroup = updateProductGroup;
  public addProductToGroup = addProductToGroup;
  public deleteProductFromGroup = deleteProductFromGroup;
  public createGroupImage = createProductGroupImage;
}

export default ProductController;
