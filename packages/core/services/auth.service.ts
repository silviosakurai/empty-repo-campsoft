import { generateRandomHashChars } from "@core/common/functions/generateRandomHashChars";
import { ITokenKeyData } from "@core/common/interfaces/ITokenKeyData";
import { AuthRepository } from "@core/repositories/client/Auth.repository";
import { ClientMagicTokenRepository } from "@core/repositories/client/ClientMagicToken.repository";
import { injectable } from "tsyringe";

@injectable()
export class AuthService {
  constructor(
    private readonly authRepository: AuthRepository,
    private readonly clientMagicTokenRepository: ClientMagicTokenRepository
  ) {}

  authenticate = async (
    tokenKeyData: ITokenKeyData,
    login: string,
    password: string
  ) => {
    return await this.authRepository.authenticate(
      tokenKeyData,
      login,
      password
    );
  };

  authenticateByClientId = async (
    tokenKeyData: ITokenKeyData,
    clientId: string,
    password: string
  ) => {
    return await this.authRepository.authenticateByClientId(
      tokenKeyData,
      clientId,
      password
    );
  };

  authenticateByMagicToken = async (
    tokenKeyData: ITokenKeyData,
    magicToken: string
  ) => {
    return await this.authRepository.authenticateByMagicToken(
      tokenKeyData,
      magicToken
    );
  };

  async generateAndVerifyMagicToken(): Promise<string> {
    let token;
    let isUnique = false;

    do {
      token = generateRandomHashChars();

      isUnique = await this.clientMagicTokenRepository.magicTokenIsUsed(token);
    } while (!isUnique);

    return token;
  }

  async createMagicToken(clientId: string, token: string): Promise<boolean> {
    return await this.clientMagicTokenRepository.create(clientId, token);
  }

  async updateMagicToken(token: string) {
    return await this.clientMagicTokenRepository.update(token);
  }
}
