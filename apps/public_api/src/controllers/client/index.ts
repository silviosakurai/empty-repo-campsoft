import { injectable } from 'tsyringe';
import { viewClient } from '@/controllers/client/methods/viewClient';
import { createClient } from './methods/createClient';
import { updateClient } from './methods/updateClient';

@injectable()
class ClientController {
  public view = viewClient;
  public create = createClient;
  public update = updateClient;
}

export default ClientController;
