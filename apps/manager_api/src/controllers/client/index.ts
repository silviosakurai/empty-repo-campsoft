import { injectable } from 'tsyringe';
import { listClient } from './methods/listClient';
import { updateClient } from './methods/updateClient';
import { createClient } from './methods/createClient';
import { viewClient } from './methods/viewClient';
import { deleteClient } from './methods/deleteClient';
import { sendSsoClient } from './methods/sendSsoClient';

@injectable()
class ClientController {
  public list = listClient;
  public create = createClient;
  public update = updateClient;
  public view = viewClient;
  public delete = deleteClient;
  public sendSso = sendSsoClient;
}

export default ClientController;
