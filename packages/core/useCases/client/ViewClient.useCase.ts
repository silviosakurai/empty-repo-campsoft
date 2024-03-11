import { ClientService } from "@core/services/client.service";
import { injectable } from "tsyringe";
import { ViewClientRequest } from "@core/useCases/client/dtos/ViewClientRequest.dto";
import { ViewClientResponse } from "@core/useCases/client/dtos/ViewClientResponse.dto";

@injectable()
export class ViewClientUseCase {
  private clientService: ClientService;

  constructor(clientService: ClientService) {
    this.clientService = clientService;
  }

  async execute({
    tokenKeyData,
    userId,
  }: ViewClientRequest): Promise<ViewClientResponse | null> {
    return await this.clientService.viewClient(tokenKeyData, userId);
  }
}
