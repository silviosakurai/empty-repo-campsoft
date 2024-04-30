import { OrderService } from "@core/services";
import { PaymentGatewayService } from "@core/services/paymentGateway.service";
import { TFunction } from "i18next";
import { injectable } from "tsyringe";
import { ResponseService } from "@core/common/interfaces/IResponseServices";
import { OrderWithPaymentReaderUseCase } from "./OrderWithPaymentViewer.useCase";

@injectable()
export class PayerByBoletoByOrderIdUseCase {
  constructor(
    private readonly orderService: OrderService,
    private readonly paymentGatewayService: PaymentGatewayService,
    private readonly orderWithPaymentReaderUseCase: OrderWithPaymentReaderUseCase
  ) {}

  async pay(t: TFunction<"translation", undefined>, orderId: string) {
    const { order, externalId, sellerId } =
      await this.orderWithPaymentReaderUseCase.view(t, orderId);

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

    return {
      data: {
        url: result.data.payment_method.url,
        code: result.data.payment_method.barcode,
      },
      status: true,
    } as ResponseService;
  }
}
