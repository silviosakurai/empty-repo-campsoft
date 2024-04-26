import { ClientService } from "@core/services";
import { TFunction } from "i18next";
import { injectable } from "tsyringe";

@injectable()
export class ClientCreditCardDefaultUpdaterUseCase {
  constructor(private readonly clientService: ClientService) {}

  async update(
    t: TFunction<"translation", undefined>,
    input: { clientId: string; cardId: string; default: boolean }
  ) {
    if (input.default) {
      return this.clientService.updateDefaultCard(input);
    }

    const cards = await this.clientService.listCreditCards(input.clientId);

    if (cards.length === 1) {
      throw new Error(t("client_must_have_a_card_as_default"));
    }

    const currentCard = cards.find((item) => item.card_id === input.cardId);

    if (!currentCard) {
      throw new Error(t("card_not_found"));
    }

    if (currentCard.default) {
      throw new Error(t("client_must_have_a_card_as_default"));
    }

    return this.clientService.updateDefaultCard(input);
  }
}
