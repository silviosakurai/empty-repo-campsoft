import { AuthService } from "@core/services/auth.service";
import { injectable } from "tsyringe";
import { LoginRequest } from "@core/useCases/auth/dtos/LoginRequest.dto";
import {
  LoginResponse,
  LoginCompleteResponse
} from "@core/useCases/auth/dtos/LoginResponse.dto";
import { PermissionService } from "@core/services/permission.service";
import { SignatureService } from "@core/services/signature.service";

@injectable()
export class LoginAuthUseCase {
  constructor(
    private readonly authService: AuthService,
    private readonly permissionService: PermissionService,
    private readonly signatureService: SignatureService
  ) {}

  async getLoginPublic({
    login,
    password,
  }: LoginRequest): Promise<LoginResponse | null> {
    const responseAuth = await this.authService.authenticate(login, password);

    if (!responseAuth) {
      return null;
    }

    const signature = await this.signatureService.findActiveByClientId(
      responseAuth.client_id
    );

    return {
      ...responseAuth,
      signature,
    };
  }

  async getLoginManager({
    login,
    password,
  }: LoginRequest): Promise<LoginCompleteResponse | null> {
    const responseAuth = await this.authService.authenticate(login, password);

    if (!responseAuth) {
      return null;
    }

    const permissions = await this.getPermissions(responseAuth.client_id);

    return {
      ...responseAuth,
      permissions,
    };
  }

  async getPermissions(clientId: string) {
    return this.permissionService.findByCliendId(clientId);
  }
}
