import { injectable } from 'tsyringe';
import { login } from '@/controllers/auth/methods/login';
import { token } from '@/controllers/auth/methods/token';

@injectable()
class AuthController {
  public login = login;
  public token = token;
}

export default AuthController;
