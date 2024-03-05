import { AuthRepository } from "@core/repositories/client/auth.repository";
import { injectable } from "tsyringe";

@injectable()
export class AuthService {
  private authRepository: AuthRepository;

  constructor(clientRepository: AuthRepository) {
    this.authRepository = clientRepository;
  }

  authenticate = async (login: string, password: string) => {
    try {
      return await this.authRepository.authenticate(login, password);
    } catch (error) {
      throw error;
    }
  };
}
