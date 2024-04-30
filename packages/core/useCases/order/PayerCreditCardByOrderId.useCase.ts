import { ClientService, OrderService } from "@core/services";
import { PaymentGatewayService } from "@core/services/paymentGateway.service";
import { injectable } from "tsyringe";
import { TFunction } from "i18next";
import { OrderWithPaymentReaderUseCase } from "./OrderWithPaymentViewer.useCase";
import { ResponseService } from "@core/common/interfaces/IResponseServices";
import { PayByCreditCardRequest } from "./dtos/PayByCreditCardRequest.dto";
import { ClientCardCreatorUseCase } from "../client/ClientCardCreator.useCase";
import CreditCardExpirationDateIsInvalidError from "@core/common/exceptions/CreditCardExpirationDateIsInvalidError";
import { checkIfDateIsAfterOfCurrent } from "@core/common/functions/checkIfDateIsAfterOfCurrent";
import { SignatureService } from "@core/services/signature.service";
import { OrderStatusEnum } from "@core/common/enums/models/order";

@injectable()
export class PayerCreditCardByOrderIdUseCase {
  constructor(
    private readonly orderService: OrderService,
    private readonly clientService: ClientService,
    private readonly signatureService: SignatureService,
    private readonly cardCreatorUseCase: ClientCardCreatorUseCase,
    private readonly paymentGatewayService: PaymentGatewayService,
    private readonly orderWithPaymentReaderUseCase: OrderWithPaymentReaderUseCase
  ) {}

  async pay(
    t: TFunction<"translation", undefined>,
    orderId: string,
    input: PayByCreditCardRequest
  ) {
    try {
      const {
        externalId: externalCustomerId,
        order,
        sellerId,
      } = await this.orderWithPaymentReaderUseCase.view(t, orderId);

      const creditCard = await this.validateCreditCard(
        order.client_id,
        externalCustomerId,
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

      await Promise.all([
        this.signatureService.activePaidSignature(
          order.order_id,
          order.order_id_previous,
          order.activation_immediate
        ),
        this.orderService.paymentOrderUpdateByOrderId(order.order_id, {
          paymentTransactionId: result.data.id,
        }),
      ]);

      const formatCreditCard = `${result.data.payment_method.first4_digits}xxxxxxxxxx${result.data.payment_method.last4_digits}`;

      return {
        data: {
          brand: result.data.payment_method.card_brand,
          number: formatCreditCard,
          credit_card_id: creditCard.card_id,
        },
        status: true,
      } as ResponseService;
    } catch (error) {
      await this.orderService.updateStatusByOrderId(
        orderId,
        OrderStatusEnum.FAILED
      );

      if (error instanceof Error) {
        if (
          error.message === "invalid_card_number" ||
          error.message === "expired_card_error" ||
          error.message === "service_request_timeout" ||
          error.message === "something_went_wrong_to_generate_credit_card"
        ) {
          throw new Error(t(error.message));
        }
      }

      throw error;
    }
  }

  private async validateCreditCard(
    clientId: string,
    externalCustomerId: string,
    t: TFunction<"translation", undefined>,
    input: PayByCreditCardRequest
  ) {
    if (input.credit_card_id) {
      return this.confirmByCreditCardId(input.credit_card_id, clientId);
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

    return false;
  }

  private async confirmByCreditCardId(creditCardId: string, clientId: string) {
    const result = await this.clientService.viewCreditCard(
      creditCardId,
      clientId
    );

    if (!result) {
      return false;
    }

    if (!result.expiration_month || !result.expiration_year) {
      throw new CreditCardExpirationDateIsInvalidError("Invalid Card");
    }

    const cardIsValid = checkIfDateIsAfterOfCurrent(
      +result.expiration_month,
      +result.expiration_year
    );

    if (!cardIsValid) return false;

    return result;
  }
}
