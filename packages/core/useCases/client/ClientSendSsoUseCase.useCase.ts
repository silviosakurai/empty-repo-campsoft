import { AuthService } from "@core/services";
import { ClientService } from "@core/services/client.service";
import { injectable } from "tsyringe";

@injectable()
export class ClientSendSsoUseCase {
  constructor(
    private readonly authService: AuthService,
    private readonly clientService: ClientService
  ) {}

  async send(clientId: string): Promise<string | null> {
    const userFounded = await this.clientService.viewById(clientId);

    if (!userFounded) {
      return null;
    }

    const generateToken = await this.authService.generateAndVerifyMagicToken();

    if (generateToken) {
      const createMagicToken = await this.authService.createMagicToken(
        clientId,
        generateToken
      );

      if (!createMagicToken) return null;

      return generateToken;
    }

    return null;
  }
}
