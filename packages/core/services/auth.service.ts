import { AuthRepository } from "@core/repositories/client/Auth.repository";
import { ViewApiResponse } from "@core/useCases/api/dtos/ViewApiResponse.dto";
import { injectable } from "tsyringe";

@injectable()
export class AuthService {
  private authRepository: AuthRepository;

  constructor(authRepository: AuthRepository) {
    this.authRepository = authRepository;
  }

  authenticate = async (
    apiAccess: ViewApiResponse,
    login: string,
    password: string
  ) => {
    try {
      return await this.authRepository.authenticate(apiAccess, login, password);
    } catch (error) {
      throw error;
    }
  };
}
