import { AuthService } from "@core/services/auth.service";
import { injectable } from "tsyringe";
import { LoginRequest } from "@core/useCases/auth/dtos/LoginRequest.dto";
import { LoginResponse } from "@core/useCases/auth/dtos/LoginResponse.dto";

@injectable()
export class LoginAuthUseCase {
  private authService: AuthService;

  constructor(clientService: AuthService) {
    this.authService = clientService;
  }

  async execute({
    tokenKeyData,
    login,
    password,
  }: LoginRequest): Promise<LoginResponse | null> {
    return await this.authService.authenticate(tokenKeyData, login, password);
  }
}
