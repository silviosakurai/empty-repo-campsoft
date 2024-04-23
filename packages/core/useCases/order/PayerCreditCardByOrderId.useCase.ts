import { ClientService, OrderService } from "@core/services";
import { PaymentGatewayService } from "@core/services/paymentGateway.service";
import { injectable } from "tsyringe";
import { TFunction } from "i18next";
import { ITokenKeyData } from "@core/common/interfaces/ITokenKeyData";
import { OrderWithPaymentReaderUseCase } from "./OrderWithPaymentViewer.useCase";
import { ResponseService } from "@core/common/interfaces/IResponseServices";
import { PayByCreditCardRequest } from "./dtos/PayByCreditCardRequest.dto";

@injectable()
export class PayerCreditCardByOrderIdUseCase {
  constructor(
    private readonly orderService: OrderService,
    private readonly clientService: ClientService,
    private readonly paymentGatewayService: PaymentGatewayService,
    private readonly orderWithPaymentReaderUseCase: OrderWithPaymentReaderUseCase
  ) {}

  async pay(
    t: TFunction<"translation", undefined>,
    tokenKey: ITokenKeyData,
    orderId: string,
    input: PayByCreditCardRequest
  ) {
    const { externalId, order, sellerId } =
      await this.orderWithPaymentReaderUseCase.view(t, tokenKey, orderId);

    const creditCard = await this.validateCreditCard(order.client_id, input);

    // const result =
    //   await this.paymentGatewayService.createTransactionCard({
    //     amount: +order.total_price * 100,
    //     customerId: externalId,
    //     description: order.observation,
    //     reference_id: order.order_id,
    //     sellerId,
    //   });

    // if (!result.data) {
    //   return result;
    // }

    // await this.orderService.paymentOrderUpdateByOrderId(order.order_id, {
    //   paymentTransactionId: result.data.id,
    //   paymentLink: result.data.payment_method.url,
    //   dueDate: result.data.payment_method.expiration_date,
    //   barcode: result.data.payment_method.barcode,
    // });

    // return {
    //   data: {
    //     url: result.data.payment_method.url,
    //     code: result.data.payment_method.barcode,
    //   },
    //   status: true,
    // } as ResponseService;
  }

  private async validateCreditCard(
    clientId: string,
    input: PayByCreditCardRequest
  ) {
    if (input.credit_card_id) {
      const result = await this.clientService.viewCreditCard(
        input.credit_card_id
      );

      if (!result) {
        return;
      }

      if (!result.expiration_month || !result.expiration_year) {
        return;
      }

      const cardIsValid = this.confirmIfCreditCardIsValidByExpirationDate(
        result.expiration_month,
        result.expiration_year
      );

      if (!cardIsValid) return;

      return result;
    }

    if (input.credit_card) {
    }
  }

  private confirmIfCreditCardIsValidByExpirationDate(
    expirationMonth: number,
    expirationYear: number
  ) {
    const last2DigitsOfCurrentYear = new Date().getFullYear() % 100;
    const currentMonth = new Date().getMonth() + 1;

    if (
      expirationMonth === last2DigitsOfCurrentYear &&
      expirationYear <= currentMonth
    ) {
      return false;
    }

    return true;
  }
}
