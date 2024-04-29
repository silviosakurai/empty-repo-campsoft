import { AuthService } from "@core/services/auth.service";
import { injectable } from "tsyringe";
import { LoginRequest } from "@core/useCases/auth/dtos/LoginRequest.dto";
import { LoginResponse } from "@core/useCases/auth/dtos/LoginResponse.dto";
import { PermissionService } from "@core/services/permission.service";

@injectable()
export class LoginAuthUseCase {
  constructor(
    private readonly authService: AuthService,
    private readonly permissionService: PermissionService
  ) {}

  async execute({
    login,
    password,
  }: LoginRequest): Promise<LoginResponse | null> {
    return this.authService.authenticate(login, password);
  }

  async getPermissions(clientId: string) {
    return this.permissionService.findByCliendId(clientId);
  }
}
