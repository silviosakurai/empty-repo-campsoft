import { injectable } from 'tsyringe';
import { viewClient } from '@/controllers/client/methods/viewClient';
import { createClient } from './methods/createClient';
import { updateClient } from './methods/updateClient';
import { updatePhoneClient } from './methods/updatePhoneClient';
import { passwordRecoveryMethodsClient } from './methods/passwordRecoveryMethodsClient';

@injectable()
class ClientController {
  public view = viewClient;
  public create = createClient;
  public update = updateClient;
  public updatePhone = updatePhoneClient;
  public passwordRecoveryMethods = passwordRecoveryMethodsClient;
}

export default ClientController;
