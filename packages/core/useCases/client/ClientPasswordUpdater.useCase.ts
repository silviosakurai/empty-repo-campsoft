import { ClientService } from "@core/services/client.service";
import { injectable } from "tsyringe";
import { ViewApiTfaResponse } from "@core/useCases/api/dtos/ViewApiTfaResponse.dto";
import { UpdatePasswordClientRequestDto } from "@core/useCases/client/dtos/UpdatePasswordClientRequest.dto";
import { encodePassword } from "@core/common/functions/encodePassword";
import { ITokenKeyData } from "@core/common/interfaces/ITokenKeyData";

@injectable()
export class ClientPasswordUpdaterUseCase {
  private clientService: ClientService;

  constructor(clientService: ClientService) {
    this.clientService = clientService;
  }

  async update(
    tfaInfo: ViewApiTfaResponse,
    tokenKeyData: ITokenKeyData,
    input: UpdatePasswordClientRequestDto
  ): Promise<boolean | null> {
    const userFounded = await this.clientService.viewClient(
      tokenKeyData,
      tfaInfo.clientId
    );

    if (!userFounded) {
      return null;
    }

    const passwordHashed = encodePassword(input.new_password);

    if (!passwordHashed) {
      return null;
    }

    const userUpdated = await this.clientService.updatePassword(
      tfaInfo,
      passwordHashed
    );

    if (!userUpdated) {
      return null;
    }

    return userUpdated;
  }
}
