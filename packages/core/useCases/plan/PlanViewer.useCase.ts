import { injectable } from "tsyringe";
import { Plan } from "@core/common/enums/models/plan";
import { PlanService } from "@core/services/plan.service";

@injectable()
export class PlanViewerUseCase {
  constructor(private readonly planService: PlanService) {}

  async execute(companyId: number, planId: number): Promise<Plan | null> {
    return this.planService.view(companyId, planId);
  }
}
