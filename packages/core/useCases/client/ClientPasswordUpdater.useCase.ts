import { ClientService } from "@core/services/client.service";
import { injectable } from "tsyringe";
import { ViewApiResponse } from "@core/useCases/api/dtos/ViewApiResponse.dto";
import { ViewApiTfaResponse } from "@core/useCases/api/dtos/ViewApiTfaResponse.dto";
import { UpdatePasswordClientRequestDto } from "@core/useCases/client/dtos/UpdatePasswordClientRequest.dto";
import { encodePassword } from "@core/common/functions/encodePassword";

@injectable()
export class ClientPasswordUpdaterUseCase {
  private clientService: ClientService;

  constructor(clientService: ClientService) {
    this.clientService = clientService;
  }

  async update(
    tfaInfo: ViewApiTfaResponse,
    apiAccess: ViewApiResponse,
    input: UpdatePasswordClientRequestDto
  ): Promise<boolean | null> {
    const userFounded = await this.clientService.viewClient(
      apiAccess,
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
