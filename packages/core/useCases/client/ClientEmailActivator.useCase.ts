import { ClientService } from "@core/services/client.service";
import { injectable } from "tsyringe";

@injectable()
export class ClientEmailActivatorUseCase {
  constructor(private readonly clientService: ClientService) {}

  async execute(token: string) {
    return this.clientService.activateEmail(token);
  }
}
