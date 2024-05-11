import { ClientService } from "@core/services/client.service";
import { injectable } from "tsyringe";
import { ITokenJwtData } from "@core/common/interfaces/ITokenJwtData";

@injectable()
export class ClientEraserUseCase {
  constructor(private readonly clientService: ClientService) {}

  async delete(tokenJwtData: ITokenJwtData): Promise<boolean | null> {
    const userFounded = await this.clientService.view(tokenJwtData.clientId);

    if (!userFounded) {
      return null;
    }

    const userDelete = await this.clientService.delete(
      tokenJwtData,
      userFounded
    );

    if (!userDelete) {
      return null;
    }

    return userDelete;
  }
}
