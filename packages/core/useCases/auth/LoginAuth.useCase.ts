import { AuthService } from "@core/services/auth.service";
import { injectable } from "tsyringe";
import { LoginRequest } from "@core/useCases/auth/dtos/LoginRequest.dto";
import { LoginCompleteResponse } from "@core/useCases/auth/dtos/LoginResponse.dto";
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
  }: LoginRequest): Promise<LoginCompleteResponse | null> {
    const responseAuth = await this.authService.authenticate(login, password);

    if (!responseAuth) {
      return null;
    }

    const permissions = await this.getPermissions(
      responseAuth.client_id
    );

    return {
      auth: responseAuth,
      permissions,
    };
  }

  async getPermissions(clientId: string) {
    return this.permissionService.findByCliendId(clientId);
  }
}
