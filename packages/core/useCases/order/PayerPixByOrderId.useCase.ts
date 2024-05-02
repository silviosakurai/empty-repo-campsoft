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
import { generateQRCodeAsJPEGBase64 } from "@core/common/functions/generateQRCodeAsJPEGBase64";
import { amountToPay } from "@core/common/functions/amountToPay";
import { existsInApiErrorCategoryZoop } from "@core/common/functions/existsInApiErrorCategoryZoop";

@injectable()
export class PayerPixByOrderIdUseCase {
  constructor(
    private readonly orderService: OrderService,
    private readonly paymentGatewayService: PaymentGatewayService,
    private readonly orderWithPaymentReaderUseCase: OrderWithPaymentReaderUseCase,
    private readonly findSignatureByOrderNumber: FindSignatureByOrderNumber
  ) {}

  async pay(t: TFunction<"translation", undefined>, orderId: string) {
    try {
      const { order, sellerId } = await this.orderWithPaymentReaderUseCase.view(
        t,
        orderId
      );

      const amountPay = amountToPay(order);

      const result = await this.paymentGatewayService.createTransactionPix({
        amount: amountPay,
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

      const pixCodeAsBase64 = await generateQRCodeAsJPEGBase64(
        result.data.payment_method.qr_code.emv
      );

      if (!pixCodeAsBase64) {
        throw new Error(t("error_generating_qr_code_pix"));
      }

      await this.orderService.createOrderPayment(
        order,
        signature.signature_id,
        OrderPaymentsMethodsEnum.PIX,
        OrderStatusEnum.PENDING,
        {
          paymentTransactionId: result.data.id,
          paymentLink: pixCodeAsBase64,
          dueDate: result.data.payment_method.expiration_date,
          codePayment: result.data.payment_method.qr_code.emv,
        }
      );

      return {
        data: {
          url: pixCodeAsBase64,
          code: result.data.payment_method.qr_code.emv,
          expire_at: result.data.payment_method.expiration_date,
        },
        status: true,
      } as ResponseService;
    } catch (error) {
      if (error instanceof Error) {
        if (existsInApiErrorCategoryZoop(error.message)) {
          throw new Error(t(error.message));
        }
      }

      throw error;
    }
  }
}
