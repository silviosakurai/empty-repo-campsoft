import { ClientService } from "@core/services/client.service";
import { injectable } from "tsyringe";
import { UpdateClientRequestDto } from "@core/useCases/client/dtos/UpdateClientRequest.dto";

@injectable()
export class ClientUpdaterUseCase {
  constructor(private readonly clientService: ClientService) {}

  async update(
    clientId: string,
    input: UpdateClientRequestDto
  ): Promise<boolean | null> {
    const userFounded = await this.clientService.view(clientId);

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
