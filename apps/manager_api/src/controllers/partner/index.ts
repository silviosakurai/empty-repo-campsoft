import { injectable } from 'tsyringe';
import { listPartnerProducts } from './methods/listPartnerProducts';
import { addProductToPartner } from './methods/addProductToPartner';
import { deleteProductFromPartner } from './methods/deleteProductFromPartner';

@injectable()
class PartnerController {
  public list = listPartnerProducts;
  public addProduct = addProductToPartner;
  public deleteFromPartner = deleteProductFromPartner;
}

export default PartnerController;
