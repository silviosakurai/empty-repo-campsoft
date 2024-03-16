import { PlanService } from "@core/services";
import { injectable } from "tsyringe";
import { Plan } from "@core/common/enums/models/plan";

@injectable()
export class ViewPlanUseCase {
  private planService: PlanService;

  constructor(planService: PlanService) {
    this.planService = planService;
  }

  async execute(companyId: number, planId: number): Promise<Plan | null> {
    return await this.planService.viewPlan(companyId, planId);
  }
}
