import { injectable } from 'tsyringe';
import { login } from '@/controllers/auth/methods/login';

@injectable()
class AuthController {
  public login = login;
}

export default AuthController;
