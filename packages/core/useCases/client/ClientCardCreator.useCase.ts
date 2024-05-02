import { ICreateCreditCardTokenRequest } from "@core/interfaces/services/payment/ICreateCreditCardToken";
import { ClientService, ZoopGatewayService } from "@core/services";
import { injectable } from "tsyringe";
import { ClientPaymentExternalGeneratorUseCase } from "./ClientPaymentExternalGenerator.useCase";
import { TFunction } from "i18next";
import { getLastFourDigits } from "@core/common/functions/getLastFourDigits";

@injectable()
export class ClientCardCreatorUseCase {
  constructor(
    private readonly clientService: ClientService,
    private readonly gatewayService: ZoopGatewayService,
    private readonly clientPaymentExternalGeneratorUseCase: ClientPaymentExternalGeneratorUseCase
  ) {}

  async create(
    clientId: string,
    t: TFunction<"translation", undefined>,
    input: ICreateCreditCardTokenRequest,
    clientExternalId?: string
  ) {
    const creditCard = await this.gatewayService.createCreditCardToken(input);
    const last4Digits = getLastFourDigits(input.card_number);

    const result = await this.clientService.createCreditCard(clientId, {
      default: input.default ?? false,
      expiration_month: +input.expiration_month,
      expiration_year: +input.expiration_year,
      externalId: creditCard.card.id,
      first4Digits: creditCard.card.first4_digits.toLocaleString("en-us", {
        minimumIntegerDigits: 4,
      }),
      last4Digits,
      brand: creditCard.card.card_brand,
      tokenId: creditCard.id,
    });

    const cards = await this.clientService.listCreditCards(clientId);

    if (input.default || cards.length === 1) {
      await this.clientService.updateDefaultCard({
        cardId: cards[0].card_id,
        clientId,
        default: true,
      });
    }

    const externalId =
      clientExternalId ?? (await this.generateExternalId(clientId, t));

    await this.gatewayService.linkCardTokenWithCustomer({
      token: creditCard.id,
      customer: externalId,
    });

    return result;
  }

  private async generateExternalId(
    clientId: string,
    t: TFunction<"translation", undefined>
  ) {
    const client = await this.clientService.view(clientId);

    if (!client) {
      throw new Error(t("client_not_found"));
    }

    const clientPayment = await this.clientService.viewPaymentClient(
      client.client_id
    );

    const externalId = clientPayment
      ? clientPayment.external_id
      : await this.clientPaymentExternalGeneratorUseCase.generate(t, client);

    return externalId;
  }
}
