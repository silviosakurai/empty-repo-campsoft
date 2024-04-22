import { ClientService } from "@core/services/client.service";
import { injectable } from "tsyringe";

@injectable()
export class ClientByIdEraserUseCase {
  constructor(private readonly clientService: ClientService) {}

  async delete(userId: string): Promise<boolean | null> {
    const userFounded = await this.clientService.viewById(userId);

    if (!userFounded) {
      return null;
    }

    const userDelete = await this.clientService.deleteById(userId, userFounded);

    if (!userDelete) {
      return null;
    }

    return userDelete;
  }
}
