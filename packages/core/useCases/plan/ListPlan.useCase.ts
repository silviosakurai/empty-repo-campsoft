import { PlanService } from "@core/services";
import { injectable } from "tsyringe";
import { ListPlanRequest } from "./dtos/ListPlanRequest.dto";

@injectable()
export class ListPlanUseCase {
  private planService: PlanService;

  constructor(planService: PlanService) {
    this.planService = planService;
  }

  async execute(companyId: number, query: ListPlanRequest): Promise<object | null> {
    return await this.planService.listPlan(companyId, query);
  }
}
