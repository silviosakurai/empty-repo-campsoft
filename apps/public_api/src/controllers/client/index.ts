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
}

export default ClientController;
