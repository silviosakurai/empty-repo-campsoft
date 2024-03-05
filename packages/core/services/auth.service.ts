import { AuthRepository } from "@core/repositories/client/auth.repository";
import { injectable } from "tsyringe";

@injectable()
export class AuthService {
  private authRepository: AuthRepository;

  constructor(authRepository: AuthRepository) {
    this.authRepository = authRepository;
  }

  authenticate = async (login: string, password: string) => {
    try {
      return await this.authRepository.authenticate(login, password);
    } catch (error) {
      throw error;
    }
  };
}
