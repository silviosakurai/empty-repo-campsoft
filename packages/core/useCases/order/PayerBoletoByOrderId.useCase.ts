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
import { amountToPay } from "@core/common/functions/amountToPay";
import { existsInApiErrorCategoryZoop } from "@core/common/functions/existsInApiErrorCategoryZoop";

@injectable()
export class PayerByBoletoByOrderIdUseCase {
  constructor(
    private readonly orderService: OrderService,
    private readonly paymentGatewayService: PaymentGatewayService,
    private readonly orderWithPaymentReaderUseCase: OrderWithPaymentReaderUseCase,
    private readonly findSignatureByOrderNumber: FindSignatureByOrderNumber
  ) {}

  async pay(t: TFunction<"translation", undefined>, orderId: string) {
    try {
      const { order, externalId, sellerId } =
        await this.orderWithPaymentReaderUseCase.view(t, orderId);

      const amountPay = amountToPay(order);

      const result =
        await this.paymentGatewayService.createTransactionSimpleTicket({
          amount: amountPay,
          customerId: externalId,
          description: order.observation,
          reference_id: order.order_id,
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
        OrderPaymentsMethodsEnum.BOLETO,
        OrderStatusEnum.PENDING,
        {
          paymentTransactionId: result.data.id,
          paymentLink: result.data.payment_method.url,
          dueDate: result.data.payment_method.expiration_date,
          codePayment: result.data.payment_method.barcode,
        }
      );

      return {
        data: {
          url: result.data.payment_method.url,
          code: result.data.payment_method.barcode,
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
