import { AuthService, ClientService } from "@core/services";
import { injectable } from "tsyringe";
import { UpdatePasswordClientRequestDto } from "./dtos/UpdatePasswordClientRequest.dto";
import { ITokenKeyData } from "@core/common/interfaces/ITokenKeyData";
import { ITokenTfaData } from "@core/common/interfaces/ITokenTfaData";
import { encodePassword } from "@core/common/functions/encodePassword";

@injectable()
export class ClientPasswordUpdaterUseCase {
  constructor(
    private readonly clientService: ClientService,
    private readonly authService: AuthService
  ) {}

  async update(
    clientId: string,
    input: UpdatePasswordClientRequestDto,
    tokenKeyData: ITokenKeyData,
    tokenTfaData: ITokenTfaData
  ): Promise<boolean | null> {
    const userLogged = await this.authService.authenticateByClientId(
      tokenKeyData,
      clientId,
      input.current_password
    );

    if (!userLogged) {
      return null;
    }

    const passwordHashed = encodePassword(input.new_password);

    if (!passwordHashed) {
      return null;
    }

    const userUpdated = await this.clientService.updatePassword(
      tokenTfaData,
      passwordHashed
    );

    if (!userUpdated) {
      return null;
    }

    return userUpdated;
  }
}
