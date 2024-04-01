import { ITokenKeyData } from "@core/common/interfaces/ITokenKeyData";
import { AuthService } from "@core/services/auth.service";
import { injectable } from "tsyringe";
import { LoginResponse } from "@core/useCases/auth/dtos/LoginResponse.dto";

@injectable()
export class TokenAuthUseCase {
  constructor(private readonly authService: AuthService) {}

  async execute(
    tokenKeyData: ITokenKeyData,
    loginToken: string
  ): Promise<LoginResponse | null> {
    const client = await this.authService.authenticateByMagicToken(
      tokenKeyData,
      loginToken
    );

    if (!client) {
      return null;
    }

    const updateMagicToken =
      await this.authService.updateMagicToken(loginToken);

    if (!updateMagicToken) {
      return null;
    }

    return client;
  }
}
