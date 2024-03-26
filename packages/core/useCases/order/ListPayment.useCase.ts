import { injectable } from "tsyringe";
import { OrderService } from "@core/services/order.service";
import { OrderPayments } from "@core/interfaces/repositories/order";

@injectable()
export class ListPaymentUseCase {
  private orderService: OrderService;

  constructor(orderService: OrderService) {
    this.orderService = orderService;
  }

  async execute(orderNumber: string): Promise<OrderPayments[] | null> {
    //TODO: GET Order By Order Number to get Order Id
    const order: any = await this.orderService.findOrderByNumber(orderNumber)

    return this.orderService.listPayment(order.id);
  }
}
