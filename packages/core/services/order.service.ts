import { injectable } from "tsyringe";
import { ListOrdersRepository } from "@core/repositories/order/ListOrders.repository";
import { ListPlanRequest } from "@core/useCases/plan/dtos/ListPlanRequest.dto";

@injectable()
export class OrderService {
  private listOrdersRepository: ListOrdersRepository;

  constructor(listOrdersRepository: ListOrdersRepository) {
    this.listOrdersRepository = listOrdersRepository;
  }

  listPlan = async (companyId: number, query: ListPlanRequest) => {
    try {
      return await this.listOrdersRepository.list(companyId, query);
    } catch (error) {
      throw error;
    }
  };
}
