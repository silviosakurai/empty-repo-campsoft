import { injectable } from 'tsyringe';
import { loginAuth } from '@/controllers/auth/methods/login';

@injectable()
class AuthController {
  public login = loginAuth;
}

export default AuthController;
