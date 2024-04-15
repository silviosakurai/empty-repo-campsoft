import { OrderService } from "@core/services";
import { TFunction } from "i18next";
import { injectable } from "tsyringe";

@injectable()
export class PayerByBoletoByOrderIdUseCase {
  constructor(private readonly orderService: OrderService) {}

  async pay(t: TFunction<"translation", undefined>, orderId: string) {
    const order = await this.orderService.listOrderById(orderId);

    if (!order) {
      throw new Error(t("order_not_found"));
    }
  }
}
