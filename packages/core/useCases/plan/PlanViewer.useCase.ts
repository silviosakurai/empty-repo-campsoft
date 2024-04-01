import { PlanService } from "@core/services";
import { injectable } from "tsyringe";
import { Plan } from "@core/common/enums/models/plan";

@injectable()
export class PlanViewerUseCase {
  constructor(private readonly planService: PlanService) {}

  async execute(companyId: number, planId: number): Promise<Plan | null> {
    return await this.planService.view(companyId, planId);
  }
}
