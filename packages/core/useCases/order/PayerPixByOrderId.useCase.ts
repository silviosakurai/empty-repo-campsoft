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
    const { order, sellerId } = await this.orderWithPaymentReaderUseCase.view(
      t,
      tokenKey,
      orderId
    );

    const result = await this.paymentGatewayService.createTransactionPix({
      amount: +order.total_price * 100,
      description: order.observation,
      sellerId,
    });

    if (!result.data) {
      return result;
    }

    // await this.orderService.paymentOrderUpdateByOrderId(order.order_id, {
    //   paymentTransactionId: result.data.id,
    //   paymentLink: result.data.payment_method.url,
    //   dueDate: result.data.payment_method.expiration_date,
    //   barcode: result.data.payment_method.barcode,
    // });

    return {
      data: {
        url: result.data.payment_method.qr_code.emv,
        code: result.data.payment_method.qr_code.emv, //transformar isso em qrcode base64
        expire_at: result.data.payment_method.expiration_date,
      },
      status: true,
    } as ResponseService;
  }
}
