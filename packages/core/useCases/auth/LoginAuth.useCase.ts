import { AuthService } from "@core/services/auth.service";
import { injectable } from "tsyringe";
import { LoginRequest } from "@core/useCases/auth/dtos/LoginRequest.dto";
import { LoginResponse } from "./dtos/LoginResponse.dto";

@injectable()
export class LoginAuthUseCase {
  private authService: AuthService;

  constructor(clientService: AuthService) {
    this.authService = clientService;
  }

  async execute({
    login,
    password,
  }: LoginRequest): Promise<LoginResponse | null> {
    return this.authService.authenticate(login, password);
  }
}
