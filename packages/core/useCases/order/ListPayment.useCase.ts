import { injectable } from "tsyringe";
import { OrderService } from "@core/services/order.service";
import { OrderPayments } from "@core/interfaces/repositories/order";
import { ITokenKeyData } from "@core/common/interfaces/ITokenKeyData";
import { ITokenJwtData } from "@core/common/interfaces/ITokenJwtData";

@injectable()
export class ListPaymentUseCase {
  private orderService: OrderService;

  constructor(orderService: OrderService) {
    this.orderService = orderService;
  }

  async execute(
    orderNumber: string,
    tokenKeyData: ITokenKeyData,
    tokenJwtData: ITokenJwtData
  ): Promise<OrderPayments[] | null> {
    const order = await this.orderService.viewOrderByNumber(
      orderNumber,
      tokenKeyData,
      tokenJwtData
    );

    if (!order) {
      return null;
    }

    return this.orderService.listPayment(order.order_id);
  }
}
