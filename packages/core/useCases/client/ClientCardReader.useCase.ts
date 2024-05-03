import { ClientService } from "@core/services";
import { injectable } from "tsyringe";

@injectable()
export class ClientCardReaderUseCase {
  constructor(private readonly clientService: ClientService) {}

  async read(clientId: string) {
    const cards = await this.clientService.listCreditCards(clientId);

    return cards;
  }
}
