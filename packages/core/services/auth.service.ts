import { generateRandomString } from "@core/common/functions/generateRandomString";
import { AuthRepository } from "@core/repositories/client/Auth.repository";
import { ClientMagicTokenRepository } from "@core/repositories/client/ClientMagicToken.repository";
import { injectable } from "tsyringe";

@injectable()
export class AuthService {
  constructor(
    private readonly authRepository: AuthRepository,
    private readonly clientMagicTokenRepository: ClientMagicTokenRepository
  ) {}

  authenticate = async (login: string, password: string) => {
    return this.authRepository.authenticate(login, password);
  };

  authenticateByClientId = async (clientId: string, password: string) => {
    return this.authRepository.authenticateByClientId(clientId, password);
  };

  authenticateByMagicToken = async (magicToken: string) => {
    return this.authRepository.authenticateByMagicToken(magicToken);
  };

  async generateAndVerifyMagicToken(): Promise<string> {
    let token;
    let isUnique = false;

    do {
      token = generateRandomString();

      isUnique = await this.clientMagicTokenRepository.magicTokenIsUsed(token);
    } while (!isUnique);

    return token;
  }

  async createMagicToken(clientId: string, token: string): Promise<boolean> {
    return this.clientMagicTokenRepository.create(clientId, token);
  }

  async updateMagicToken(token: string) {
    return this.clientMagicTokenRepository.update(token);
  }
}
