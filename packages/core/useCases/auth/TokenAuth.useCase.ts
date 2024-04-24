import { AuthService } from "@core/services/auth.service";
import { injectable } from "tsyringe";
import { LoginResponse } from "@core/useCases/auth/dtos/LoginResponse.dto";

@injectable()
export class TokenAuthUseCase {
  constructor(private readonly authService: AuthService) {}

  async execute(loginToken: string): Promise<LoginResponse | null> {
    const client = await this.authService.authenticateByMagicToken(loginToken);

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
