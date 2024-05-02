import { injectable } from 'tsyringe';
import { listClient } from './methods/listClient';
import { updateClient } from './methods/updateClient';
import { viewClient } from './methods/viewClient';
import { deleteClient } from './methods/deleteClient';

@injectable()
class ClientController {
  public list = listClient;
  public update = updateClient;
  public view = viewClient;
  public delete = deleteClient;
}

export default ClientController;
