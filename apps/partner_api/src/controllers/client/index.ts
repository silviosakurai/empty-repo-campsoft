import { injectable } from 'tsyringe';
import { listClient } from './methods/listClient';
import { updateClient } from './methods/updateClient';

@injectable()
class ClientController {
  public list = listClient;
  public update = updateClient;

}

export default ClientController;
