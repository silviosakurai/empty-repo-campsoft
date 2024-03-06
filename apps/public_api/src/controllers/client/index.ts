import { injectable } from 'tsyringe';
import { viewClient } from '@/controllers/client/methods/viewClient';
import { createClient } from './methods/createClient';

@injectable()
class ClientController {
  public view = viewClient;
  public create = createClient;
}

export default ClientController;
