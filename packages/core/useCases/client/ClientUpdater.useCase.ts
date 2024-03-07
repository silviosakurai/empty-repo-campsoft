import { ClientService } from "@core/services/client.service";
import { injectable } from "tsyringe";
import { UpdateClientRequestDto } from "./dtos/UpdateClientRequest.dto";

@injectable()
export class ClientUpdaterUseCase {
  private clientService: ClientService;

  constructor(clientService: ClientService) {
    this.clientService = clientService;
  }

  async update(
    clientId: string,
    input: UpdateClientRequestDto
  ): Promise<{ user_id: string } | null> {
    const userUpdated = await this.clientService.update(clientId, input);

    if (!userUpdated) {
      return null;
    }

    return userUpdated;
  }
}
