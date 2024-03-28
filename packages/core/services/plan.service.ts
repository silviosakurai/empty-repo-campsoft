import { injectable } from "tsyringe";
import { ListPlanRepository } from "@core/repositories/plan/ListPlan.repository";
import { ViewPlanRepository } from "@core/repositories/plan/ViewPlan.repository";
import { ListPlanRequest } from "@core/useCases/plan/dtos/ListPlanRequest.dto";
import { UpgradePlanRepository } from "@core/repositories/plan/UpgradePlan.repository";

@injectable()
export class PlanService {
  constructor(
    private readonly planListerRepository: ListPlanRepository,
    private readonly planViewerRepository: ViewPlanRepository,
    private readonly planUpgraderRepository: UpgradePlanRepository
  ) {}

  listPlan = async (companyId: number, query: ListPlanRequest) => {
    try {
      return await this.planListerRepository.list(companyId, query);
    } catch (error) {
      throw error;
    }
  };

  viewPlan = async (companyId: number, planId: number) => {
    try {
      return await this.planViewerRepository.get(companyId, planId);
    } catch (error) {
      throw error;
    }
  };

  upgradePlan = async (
    companyId: number,
    clientId: string,
    productIds: string[]
  ) => {
    try {
      return await this.planUpgraderRepository.get(
        companyId,
        clientId,
        productIds
      );
    } catch (error) {
      throw error;
    }
  };
}
