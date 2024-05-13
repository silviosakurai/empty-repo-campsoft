import { injectable } from "tsyringe";
import { ListPlanRequest } from "./dtos/ListPlanRequest.dto";
import { PlanService } from "@core/services/plan.service";

@injectable()
export class PlansListerUseCase {
  constructor(private readonly planService: PlanService) {}

  async execute(
    companyId: number,
    query: ListPlanRequest
  ): Promise<object | null> {
    return this.planService.list(companyId, query);
  }
}
