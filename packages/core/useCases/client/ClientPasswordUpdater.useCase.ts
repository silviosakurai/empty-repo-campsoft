import { injectable } from "tsyringe";
import { UpdatePasswordClientRequestDto } from "./dtos/UpdatePasswordClientRequest.dto";
import { ITokenTfaData } from "@core/common/interfaces/ITokenTfaData";
import { encodePassword } from "@core/common/functions/encodePassword";
import { ClientService } from "@core/services/client.service";
import { AuthService } from "@core/services/auth.service";

@injectable()
export class ClientPasswordUpdaterUseCase {
  constructor(
    private readonly clientService: ClientService,
    private readonly authService: AuthService
  ) {}

  async update(
    clientId: string,
    input: UpdatePasswordClientRequestDto,
    tokenTfaData: ITokenTfaData
  ): Promise<boolean | null> {
    const userLogged = await this.authService.authenticateByClientId(
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
