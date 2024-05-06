import { ClientService } from "@core/services";
import { PaymentGatewayService } from "@core/services/paymentGateway.service";
import { TFunction } from "i18next";
import { injectable } from "tsyringe";

@injectable()
export class ClientCardEraserUseCase {
  constructor(
    private readonly clientService: ClientService,
    private readonly gatewayService: PaymentGatewayService
  ) {}

  async erase(
    clientId: string,
    cardId: string,
    t: TFunction<"translation", undefined>
  ) {
    const creditCard = await this.clientService.viewCreditCard(
      cardId,
      clientId
    );

    if (!creditCard) {
      throw new Error(t("card_not_found"));
    }

    if (creditCard.default) {
      throw new Error(t("client_must_have_a_card_as_default"));
    }

    const [cardErased] = await Promise.all([
      this.clientService.eraseCreditCard(cardId),
      this.gatewayService.removeCardById(creditCard.external_id),
    ]);

    return cardErased;
  }
}
