import { ClientService } from "@core/services/client.service";
import { injectable } from "tsyringe";
import { UpdatePasswordRecoveryClientRequestDto } from "@core/useCases/client/dtos/UpdatePasswordRecoveryClientRequest.dto";
import { encodePassword } from "@core/common/functions/encodePassword";
import { ITokenTfaData } from "@core/common/interfaces/ITokenTfaData";

@injectable()
export class ClientPasswordRecoveryUpdaterUseCase {
  constructor(private readonly clientService: ClientService) {}

  async update(
    tokenTfaData: ITokenTfaData,
    input: UpdatePasswordRecoveryClientRequestDto
  ): Promise<boolean | null> {
    const userFounded = await this.clientService.view(tokenTfaData.clientId);

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
