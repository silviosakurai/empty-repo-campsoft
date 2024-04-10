import { ClientService } from "@core/services";
import { injectable } from "tsyringe";

@injectable()
export class ClientEmailActivatorUseCase {
  constructor(private readonly clientService: ClientService) {}

  async execute(clientId: string, token: string) {
    return this.clientService.activateEmail(clientId, token);
  }
}
