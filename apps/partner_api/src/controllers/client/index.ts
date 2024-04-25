import { injectable } from 'tsyringe';
import { listClient } from './methods/listClient';
import { updateClient } from './methods/updateClient';
import { viewClient } from './methods/viewClient';

@injectable()
class ClientController {
  public list = listClient;
  public update = updateClient;
<<<<<<< HEAD
  public view = viewClient;
=======
>>>>>>> e9bac1769e682718ba4994a18357fc2e3e4d39e3
}

export default ClientController;
