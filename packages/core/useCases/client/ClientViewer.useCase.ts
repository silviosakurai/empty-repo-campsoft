import { ClientService } from "@core/services/client.service";
import { injectable } from "tsyringe";
import { ViewClientRequest } from "@core/useCases/client/dtos/ViewClientRequest.dto";
import { ViewClientResponse } from "@core/useCases/client/dtos/ViewClientResponse.dto";

@injectable()
export class ClientViewerUseCase {
  constructor(private readonly clientService: ClientService) {}

  async execute({
    userId,
  }: ViewClientRequest): Promise<ViewClientResponse | null> {
    return this.clientService.view(userId);
  }
}
