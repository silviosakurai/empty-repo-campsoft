import { PlanService } from "@core/services";
import { injectable } from "tsyringe";
import { ListPlanRequest } from "./dtos/ListPlanRequest.dto";

@injectable()
export class PlansListerByCompanyUseCase {
  constructor(private readonly planService: PlanService) {}

  async execute(query: ListPlanRequest): Promise<object | null> {
    return this.planService.listByCompany(query);
  }
}
