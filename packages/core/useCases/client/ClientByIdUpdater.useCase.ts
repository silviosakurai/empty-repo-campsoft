import { ClientService } from "@core/services/client.service";
import { injectable } from "tsyringe";
import { UpdateClientByIdRequestDto } from "./dtos/updateClientByIdRequest.dto";

@injectable()
export class ClientByIdUpdaterUseCase {
  constructor(private readonly clientService: ClientService) {}

  async update(
    clientId: string,
    input: UpdateClientByIdRequestDto
  ): Promise<boolean | null> {
    const userFounded = await this.clientService.view(clientId);

    if (!userFounded) {
      return null;
    }

    const userUpdated = await this.clientService.updateById(clientId, input);

    if (!userUpdated) {
      return null;
    }

    return userUpdated;
  }
}
