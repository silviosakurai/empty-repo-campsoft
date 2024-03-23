import { OrderService } from "@core/services/order.service";
import { injectable } from "tsyringe";
import { ListPlanRequest } from "./dtos/ListPlanRequest.dto";

@injectable()
export class ListOrdersUseCase {
  private orderService: OrderService;

  constructor(orderService: OrderService) {
    this.orderService = orderService;
  }

  async execute(companyId: number, query: ListPlanRequest) {
    return await this.orderService.listPlan(companyId, query);
  }
}
