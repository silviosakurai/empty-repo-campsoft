import { ICreateCreditCardTokenRequest } from "@core/interfaces/services/payment/ICreateCreditCardToken";
import { ClientService, ZoopGatewayService } from "@core/services";
import { injectable } from "tsyringe";

@injectable()
export class ClientCardCreatorUseCase {
  constructor(
    private readonly clientService: ClientService,
    private readonly gatewayService: ZoopGatewayService
  ) {}

  async create(
    clientId: string,
    clientExternalId: string,
    input: ICreateCreditCardTokenRequest
  ) {
    const creditCard = await this.gatewayService.createCreditCardToken(input);

    const result = await this.clientService.createCreditCard(clientId, {
      default: input.default ?? false,
      expiration_month: +input.expiration_month,
      expiration_year: +input.expiration_year,
      externalId: creditCard.id,
      first4Digits: creditCard.card.first4_digits.toLocaleString("en-us", {
        minimumIntegerDigits: 4,
      }),
      brand: creditCard.card.card_brand,
    });

    const cards = await this.clientService.listCreditCards(clientId);

    if (input.default || cards.length === 1) {
      await this.clientService.updateDefaultCard({
        cardId: cards[0].card_id,
        clientId,
        default: true,
      });
    }

    await this.gatewayService.linkCardTokenWithCustomer({
      token: creditCard.id,
      customer: clientExternalId,
    });

    return result;
  }
}
