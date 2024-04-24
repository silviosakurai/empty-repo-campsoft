import { ITokenKeyData } from "@core/common/interfaces/ITokenKeyData";
import { OrderService } from "@core/services";
import { PaymentGatewayService } from "@core/services/paymentGateway.service";
import { TFunction } from "i18next";
import { injectable } from "tsyringe";
import { ResponseService } from "@core/common/interfaces/IResponseServices";
import { OrderWithPaymentReaderUseCase } from "./OrderWithPaymentViewer.useCase";

@injectable()
export class PayerPixByOrderIdUseCase {
  constructor(
    private readonly orderService: OrderService,
    private readonly paymentGatewayService: PaymentGatewayService,
    private readonly orderWithPaymentReaderUseCase: OrderWithPaymentReaderUseCase
  ) {}

  async pay(
    t: TFunction<"translation", undefined>,
    tokenKey: ITokenKeyData,
    orderId: string
  ) {
    const { order, externalId, sellerId } =
      await this.orderWithPaymentReaderUseCase.view(t, tokenKey, orderId);

    const result =
      await this.paymentGatewayService.createTransactionSimpleTicket({
        amount: +order.total_price * 100,
        customerId: externalId,
        description: order.observation,
        reference_id: order.order_id,
        sellerId,
      });

    if (!result.data) {
      return result;
    }

    await this.orderService.paymentOrderUpdateByOrderId(order.order_id, {
      paymentTransactionId: result.data.id,
      paymentLink: result.data.payment_method.url,
      dueDate: result.data.payment_method.expiration_date,
      barcode: result.data.payment_method.barcode,
    });

    console.log(result);

    return {
      data: {
        url: "http://xxxxx",
        code: "10000 0000 00000 0000 000000 00000",
        expire_at: new Date(),
      },
      status: true,
    } as ResponseService;
  }
}
