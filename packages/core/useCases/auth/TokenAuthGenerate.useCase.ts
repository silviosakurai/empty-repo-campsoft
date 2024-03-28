import { ITokenKeyData } from "@core/common/interfaces/ITokenKeyData";
import { AuthService } from "@core/services/auth.service";
import { ClientService } from "@core/services/client.service";
import { injectable } from "tsyringe";

@injectable()
export class TokenAuthGenerateUseCase {
  private authService: AuthService;
  private clientService: ClientService;

  constructor(authService: AuthService, clientService: ClientService) {
    this.authService = authService;
    this.clientService = clientService;
  }

  async execute(
    tokenKeyData: ITokenKeyData,
    clientId: string
  ): Promise<boolean> {
    const userFounded = await this.clientService.view(tokenKeyData, clientId);

    if (!userFounded) {
      return false;
    }

    const generateToken = await this.authService.generateAndVerifyMagicToken();

    if (generateToken) {
      return await this.authService.createMagicToken(clientId, generateToken);
    }

    return false;
  }
}
