import { OrderService } from "@core/services/order.service";
import { injectable } from "tsyringe";

@injectable()
export class FindOrderByNumberUseCase {
  constructor(private readonly orderService: OrderService) {}

  async find(orderNumber: string) {
    return await this.orderService.findOrderByNumber(orderNumber);
  }
}
