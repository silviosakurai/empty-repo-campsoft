import { ClientService } from "@core/services/client.service";
import { injectable } from "tsyringe";
import { UpdateClientRequestDto } from "./dtos/UpdateClientRequest.dto";
import { ViewApiResponse } from "../api/dtos/ViewApiResponse.dto";

@injectable()
export class ClientUpdaterUseCase {
  private clientService: ClientService;

  constructor(clientService: ClientService) {
    this.clientService = clientService;
  }

  async update(
    clientId: string,
    input: UpdateClientRequestDto,
    apiAccess: ViewApiResponse
  ): Promise<boolean | null> {
    const userFounded = await this.clientService.viewClient(
      apiAccess,
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
