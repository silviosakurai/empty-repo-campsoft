import { ClientService, OrderService } from "@core/services";
import { PaymentGatewayService } from "@core/services/paymentGateway.service";
import { injectable } from "tsyringe";
import { TFunction } from "i18next";
import { ITokenKeyData } from "@core/common/interfaces/ITokenKeyData";
import { OrderWithPaymentReaderUseCase } from "./OrderWithPaymentViewer.useCase";
import { ResponseService } from "@core/common/interfaces/IResponseServices";

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
    orderId: string
  ) {
    const { externalId, order, sellerId } =
      await this.orderWithPaymentReaderUseCase.view(t, tokenKey, orderId);

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

  private async validateCreditCard(clientId: string) {
    const creditCardsRegistered =
      await this.clientService.readCreditCardByClientId(clientId);

    creditCardsRegistered.find((item) => {
      const last2DigitsOfCurrentYear = +new Date().getFullYear() % 100;

      // if (
      //   item.expiration_year === last2DigitsOfCurrentYear &&
      //   item.expiration_month <= new Date().getMonth()
      // ) {
      //   return;
      // }
    });
  }
}
