import { ClientService } from "@core/services/client.service";
import { injectable } from "tsyringe";
import { UpdateClientRequestDto } from "@core/useCases/client/dtos/UpdateClientRequest.dto";
import { ITokenKeyData } from "@core/common/interfaces/ITokenKeyData";

@injectable()
export class ClientUpdaterUseCase {
  private clientService: ClientService;

  constructor(clientService: ClientService) {
    this.clientService = clientService;
  }

  async update(
    clientId: string,
    input: UpdateClientRequestDto,
    tokenKeyData: ITokenKeyData
  ): Promise<boolean | null> {
    const userFounded = await this.clientService.viewClient(
      tokenKeyData,
      clientId
    );

    if (!userFounded) {
      return null;
    }

    const userUpdated = await this.clientService.update(clientId, input);

    if (!userUpdated) {
      return null;
    }

    return userUpdated;
  }
}
