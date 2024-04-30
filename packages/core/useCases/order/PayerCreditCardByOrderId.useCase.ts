import { ClientService, OrderService } from "@core/services";
import { PaymentGatewayService } from "@core/services/paymentGateway.service";
import { injectable } from "tsyringe";
import { TFunction } from "i18next";
import { ITokenKeyData } from "@core/common/interfaces/ITokenKeyData";
import { OrderWithPaymentReaderUseCase } from "./OrderWithPaymentViewer.useCase";
import { ResponseService } from "@core/common/interfaces/IResponseServices";
import { PayByCreditCardRequest } from "./dtos/PayByCreditCardRequest.dto";
import { ClientCardCreatorUseCase } from "../client/ClientCardCreator.useCase";
import CreditCardExpirationDateIsInvalidError from "@core/common/exceptions/CreditCardExpirationDateIsInvalidError";
import { checkIfDateIsAfterOfCurrent } from "@core/common/functions/checkIfDateIsAfterOfCurrent";

@injectable()
export class PayerCreditCardByOrderIdUseCase {
  constructor(
    private readonly orderService: OrderService,
    private readonly clientService: ClientService,
    private readonly cardCreatorUseCase: ClientCardCreatorUseCase,
    private readonly paymentGatewayService: PaymentGatewayService,
    private readonly orderWithPaymentReaderUseCase: OrderWithPaymentReaderUseCase
  ) {}

  async pay(
    t: TFunction<"translation", undefined>,
    tokenKey: ITokenKeyData,
    orderId: string,
    input: PayByCreditCardRequest
  ) {
    const {
      externalId: externalCustomerId,
      order,
      sellerId,
    } = await this.orderWithPaymentReaderUseCase.view(t, tokenKey, orderId);

    const creditCard = await this.validateCreditCard(
      order.client_id,
      externalCustomerId,
      tokenKey,
      t,
      input
    );

    if (!creditCard) {
      throw new Error(t("something_went_wrong_to_generate_credit_card"));
    }

    const result = await this.paymentGatewayService.createTransactionCardId({
      amount: +order.total_price * 100,
      description: order.observation,
      reference_id: order.order_id,
      sellerId,
      cardId: creditCard.external_id,
      usage: "single_use",
    });

    if (!result.data) {
      return result;
    }

    await this.orderService.paymentOrderUpdateByOrderId(order.order_id, {
      paymentTransactionId: result.data.id,
    });

    const formatCreditCard = `${result.data.payment_method.first4_digits}xxxxxxxxxx${result.data.payment_method.last4_digits}`;

    return {
      data: {
        brand: result.data.payment_method.card_brand,
        number: formatCreditCard,
        credit_card_id: creditCard.card_id,
      },
      status: true,
    } as ResponseService;
  }

  private async validateCreditCard(
    clientId: string,
    externalCustomerId: string,
    tokenKey: ITokenKeyData,
    t: TFunction<"translation", undefined>,
    input: PayByCreditCardRequest
  ) {
    if (input.credit_card_id) {
      return this.confirmByCreditCardId(input.credit_card_id);
    }

    if (input.credit_card) {
      const client = await this.clientService.view(clientId);

      if (!client) {
        return;
      }

      await this.cardCreatorUseCase.create(
        clientId,
        t,
        {
          card_number: input.credit_card.number,
          expiration_month: input.credit_card.expire_month.toString(),
          expiration_year: input.credit_card.expire_year.toString(),
          holder_name: `${client.first_name} ${client.last_name}`,
          security_code: input.credit_card.cvv,
          default: true,
        },
        externalCustomerId
      );

      const [creditCard] = await this.clientService.listCreditCards(clientId);

      return creditCard;
    }
  }

  private async confirmByCreditCardId(creditCardId: string) {
    const result = await this.clientService.viewCreditCard(creditCardId);

    if (!result) {
      return;
    }

    if (!result.expiration_month || !result.expiration_year) {
      throw new CreditCardExpirationDateIsInvalidError("Invalid Card");
    }

    const cardIsValid = checkIfDateIsAfterOfCurrent(
      +result.expiration_month,
      +result.expiration_year
    );

    if (!cardIsValid) return;

    return result;
  }
}
