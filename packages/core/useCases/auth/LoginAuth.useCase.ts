import { AuthService } from "@core/services/auth.service";
import { injectable } from "tsyringe";
import { LoginRequest } from "@core/useCases/auth/dtos/LoginRequest.dto";
import { LoginResponse } from "@core/useCases/auth/dtos/LoginResponse.dto";

@injectable()
export class LoginAuthUseCase {
  constructor(private readonly authService: AuthService) {}

  async execute({
    login,
    password,
  }: LoginRequest): Promise<LoginResponse | null> {
    return this.authService.authenticate(login, password);
  }
}
