import { injectable } from 'tsyringe';
import { listClient } from './methods/listClient';
import { updateClient } from './methods/updateClient';
import { createClient } from './methods/createClient';

@injectable()
class ClientController {
  public list = listClient;
  public create = createClient;
  public update = updateClient;
}

export default ClientController;
