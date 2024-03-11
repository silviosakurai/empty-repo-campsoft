import { ClientService } from "@core/services/client.service";
import { injectable } from "tsyringe";
import { UpdatePhoneClientRequestDto } from "./dtos/UpdatePhoneClientRequest.dto";
import { ITokenKeyData } from "@core/common/interfaces/ITokenKeyData";

@injectable()
export class ClientPhoneUpdaterUseCase {
  private clientService: ClientService;

  constructor(clientService: ClientService) {
    this.clientService = clientService;
  }

  async update(
    clientId: string,
    input: UpdatePhoneClientRequestDto,
    tokenKeyData: ITokenKeyData
  ): Promise<boolean | null> {
    const userFounded = await this.clientService.viewClient(
      tokenKeyData,
      clientId
    );

    if (!userFounded) {
      return null;
    }

    const userUpdated = await this.clientService.updatePhone(clientId, input);

    if (!userUpdated) {
      return null;
    }

    return userUpdated;
  }
}
