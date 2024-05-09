import { injectable } from 'tsyringe';
import { listPartner } from './methods/listPartner';
import { listPartnerProducts } from './methods/listPartnerProducts';
import { addProductToPartner } from './methods/addProductToPartner';
import { deleteProductFromPartner } from './methods/deleteProductFromPartner';
import { createPartner } from './methods/createPartner';
import { updatePartner } from './methods/updatePartner';
import { deletePartner } from './methods/deletePartner';

@injectable()
class PartnerController {
  public list = listPartner;
  public create = createPartner;
  public update = updatePartner;
  public delete = deletePartner;
  public listProduct = listPartnerProducts;
  public addProduct = addProductToPartner;
  public deleteProductFromPartner = deleteProductFromPartner;
}

export default PartnerController;
