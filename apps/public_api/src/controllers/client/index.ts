import { injectable } from 'tsyringe';
import { viewClient } from '@/controllers/client/methods/viewClient';
import { createClient } from './methods/createClient';
import { updateClient } from './methods/updateClient';
import { updatePhoneClient } from './methods/updatePhoneClient';
import { updatePasswordClient } from './methods/updatePasswordClient';
import { passwordRecoveryMethodsClient } from './methods/passwordRecoveryMethodsClient';
import { updatePasswordRecoveryClient } from './methods/updatePasswordRecoveryClient';
import { deleteClient } from './methods/deleteClient';
import { viewVoucher } from './methods/viewVoucher';
import { getBillingAddress } from './methods/getBillingAddress';
import { getShippingAddress } from './methods/getShippingAddress';
import { putBillingAddress } from './methods/putBillingAddress';
import { putShippingAddress } from './methods/putShippingAddress';
import { patchShippingAddress } from './methods/patchShippingAddress';
import { patchImage } from './methods/patchImage';
import { createCardClient } from './methods/createCardClient';
import { updateUserCreditCardDefault } from './methods/updateUserCreditCardDefault';
import { eraseCardClient } from './methods/eraseCardClient';
import { readCardsClient } from './methods/readCardsClient';

@injectable()
class ClientController {
  public view = viewClient;
  public create = createClient;
  public update = updateClient;
  public delete = deleteClient;
  public updatePhone = updatePhoneClient;
  public updatePassword = updatePasswordClient;
  public passwordRecoveryMethods = passwordRecoveryMethodsClient;
  public updatePasswordRecovery = updatePasswordRecoveryClient;
  public viewVoucher = viewVoucher;
  public getBillingAddress = getBillingAddress;
  public getShippingAddress = getShippingAddress;
  public putBillingAddress = putBillingAddress;
  public putShippingAddress = putShippingAddress;
  public patchShippingAddress = patchShippingAddress;
  public patchImage = patchImage;
  public createCardClient = createCardClient;
  public updateUserCreditCardDefault = updateUserCreditCardDefault;
  public eraseCardClient = eraseCardClient;
  public readCardsClient = readCardsClient;
}

export default ClientController;
