import { ClientService } from "@core/services/client.service";
import { injectable } from "tsyringe";
import { ViewClientRequest } from "@core/useCases/client/dtos/ViewClientRequest.dto";
import { ViewClientByIdResponse } from "./dtos/ViewClientByIdResponse.dto";

@injectable()
export class ClientByIdViewerUseCase {
  constructor(private readonly clientService: ClientService) {}

  async execute({
    tokenKeyData,
    userId,
  }: ViewClientRequest): Promise<ViewClientByIdResponse | null> {
    return this.clientService.viewById(tokenKeyData, userId);
  }
}
