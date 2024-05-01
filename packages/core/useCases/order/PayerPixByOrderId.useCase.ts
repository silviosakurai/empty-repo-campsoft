import { OrderService } from "@core/services";
import { PaymentGatewayService } from "@core/services/paymentGateway.service";
import { TFunction } from "i18next";
import { injectable } from "tsyringe";
import { ResponseService } from "@core/common/interfaces/IResponseServices";
import { OrderWithPaymentReaderUseCase } from "./OrderWithPaymentViewer.useCase";
import { FindSignatureByOrderNumber } from "@core/repositories/signature/FindSignatureByOrder.repository";
import {
  OrderPaymentsMethodsEnum,
  OrderStatusEnum,
} from "@core/common/enums/models/order";

@injectable()
export class PayerPixByOrderIdUseCase {
  constructor(
    private readonly orderService: OrderService,
    private readonly paymentGatewayService: PaymentGatewayService,
    private readonly orderWithPaymentReaderUseCase: OrderWithPaymentReaderUseCase,
    private readonly findSignatureByOrderNumber: FindSignatureByOrderNumber
  ) {}

  async pay(t: TFunction<"translation", undefined>, orderId: string) {
    const { order, sellerId } = await this.orderWithPaymentReaderUseCase.view(
      t,
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

    const signature =
      await this.findSignatureByOrderNumber.findByOrder(orderId);

    if (!signature) {
      throw new Error(t("signature_not_found"));
    }

    await this.orderService.createOrderPayment(
      order,
      signature.signature_id,
      OrderPaymentsMethodsEnum.PIX,
      OrderStatusEnum.PENDING,
      {
        paymentTransactionId: result.data.id,
        paymentLink: result.data.payment_method.qr_code.emv,
        dueDate: result.data.payment_method.expiration_date,
      }
    );

    const pixCodeAsBase64 = Buffer.from(
      result.data.payment_method.qr_code.emv
    ).toString("base64");

    return {
      data: {
        url: result.data.payment_method.qr_code.emv,
        code: pixCodeAsBase64,
        expire_at: result.data.payment_method.expiration_date,
      },
      status: true,
    } as ResponseService;
  }
}
