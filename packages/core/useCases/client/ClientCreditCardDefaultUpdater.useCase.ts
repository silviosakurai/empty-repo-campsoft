import { ClientService } from "@core/services";
import { injectable } from "tsyringe";

@injectable()
export class ClientCreditCardDefaultUpdaterUseCase {
  constructor(private readonly clientService: ClientService) {}

  async update(input: { clientId: string; cardId: string; default: boolean }) {
    return this.clientService.updateDefaultCard(input);
  }
}
