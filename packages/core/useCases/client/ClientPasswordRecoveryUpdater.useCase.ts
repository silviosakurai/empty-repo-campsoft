import { ClientService } from "@core/services/client.service";
import { injectable } from "tsyringe";
import { UpdatePasswordRecoveryClientRequestDto } from "@core/useCases/client/dtos/UpdatePasswordRecoveryClientRequest.dto";
import { encodePassword } from "@core/common/functions/encodePassword";
import { ITokenKeyData } from "@core/common/interfaces/ITokenKeyData";
import { ITokenTfaData } from "@core/common/interfaces/ITokenTfaData";

@injectable()
export class ClientPasswordRecoveryUpdaterUseCase {
  private clientService: ClientService;

  constructor(clientService: ClientService) {
    this.clientService = clientService;
  }

  async update(
    tokenTfaData: ITokenTfaData,
    tokenKeyData: ITokenKeyData,
    input: UpdatePasswordRecoveryClientRequestDto
  ): Promise<boolean | null> {
    const userFounded = await this.clientService.view(
      tokenKeyData,
      tokenTfaData.clientId
    );

    if (!userFounded) {
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
