import { PlanService } from "@core/services";
import { injectable } from "tsyringe";
import { Plan } from "@core/common/enums/models/plan";

@injectable()
export class PlanViewerByCompanyUseCase {
  constructor(private readonly planService: PlanService) {}

  async execute(planId: number): Promise<Plan | null> {
    return this.planService.viewByCompany(planId);
  }
}
