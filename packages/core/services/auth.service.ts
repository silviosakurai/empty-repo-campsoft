import { ITokenKeyData } from "@core/common/interfaces/ITokenKeyData";
import { AuthRepository } from "@core/repositories/client/Auth.repository";
import { injectable } from "tsyringe";

@injectable()
export class AuthService {
  private authRepository: AuthRepository;

  constructor(authRepository: AuthRepository) {
    this.authRepository = authRepository;
  }

  authenticate = async (
    tokenKeyData: ITokenKeyData,
    login: string,
    password: string
  ) => {
    try {
      return await this.authRepository.authenticate(
        tokenKeyData,
        login,
        password
      );
    } catch (error) {
      throw error;
    }
  };
}
