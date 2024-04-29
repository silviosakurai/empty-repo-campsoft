import { ClientService } from "@core/services/client.service";
import { injectable } from "tsyringe";
import { ViewClientResponse } from "@core/useCases/client/dtos/ViewClientResponse.dto";

@injectable()
export class ClientViewerUseCase {
  constructor(private readonly clientService: ClientService) {}

  async execute(userId: string): Promise<ViewClientResponse | null> {
    return this.clientService.view(userId);
  }
}
