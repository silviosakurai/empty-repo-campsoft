import { OrderService } from "@core/services";
import { PaymentService } from "@core/services/payment.service";
import { PaymentGatewayService } from "@core/services/paymentGateway.service";
import { TFunction } from "i18next";
import { injectable } from "tsyringe";

@injectable()
export class PayerByBoletoByOrderIdUseCase {
  constructor(
    private readonly orderService: OrderService,
    private readonly paymentService: PaymentService,
    private readonly paymentGatewayService: PaymentGatewayService
  ) {}

  async pay(t: TFunction<"translation", undefined>, orderId: string) {
    const order = await this.orderService.listOrderById(orderId);

    if (!order) {
      throw new Error(t("order_not_found"));
    }

    const sellerId = order.seller_id
      ? order.seller_id
      : await this.paymentService.sellerViewByEmail(
          "ricardo@maniadeapp.com.br"
        );

    if (!sellerId) {
      throw new Error(t("seller_not_found"));
    }
  }
}
