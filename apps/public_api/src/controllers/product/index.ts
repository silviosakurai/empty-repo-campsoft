import { injectable } from 'tsyringe';
import { listProduct } from './methods/listProduct';
import { viewProduct } from './methods/viewProduct';
import { listCrossSellProduct } from './methods/listCrossSellProduct';
import { listAllProduct } from './methods/listAllProduct';
import { listAllProductUserLogged } from './methods/listAllProductUserLogged';

@injectable()
class ProductController {
  public list = listProduct;
  public listAll = listAllProduct;
  public listLogged = listAllProductUserLogged;
  public view = viewProduct;
  public listCrossSell = listCrossSellProduct;
}

export default ProductController;
