import { injectable } from 'tsyringe';
import { viewClient } from '@/controllers/client/methods/viewClient';

@injectable()
class ClientController {
  public view = viewClient;
}

export default ClientController;
