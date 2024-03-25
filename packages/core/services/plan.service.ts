import { injectable } from "tsyringe";
import { ListPlanRepository } from "@core/repositories/plan/ListPlan.repository";
import { ViewPlanRepository } from "@core/repositories/plan/ViewPlan.repository";
import { ListPlanRequest } from "@core/useCases/plan/dtos/ListPlanRequest.dto";
import { UpgradePlanRepository } from "@core/repositories/plan/UpgradePlan.repository";

@injectable()
export class PlanService {
  private listPlanRepository: ListPlanRepository;
  private viewPlanRepository: ViewPlanRepository;
  private upgradePlanRepository: UpgradePlanRepository;

  constructor(
    listPlanRepository: ListPlanRepository,
    viewPlanRepository: ViewPlanRepository,
    upgradePlanRepository: UpgradePlanRepository
  ) {
    this.listPlanRepository = listPlanRepository;
    this.viewPlanRepository = viewPlanRepository;
    this.upgradePlanRepository = upgradePlanRepository;
  }

  listPlan = async (companyId: number, query: ListPlanRequest) => {
    try {
      return await this.listPlanRepository.list(companyId, query);
    } catch (error) {
      throw error;
    }
  };

  viewPlan = async (companyId: number, planId: number) => {
    try {
      return await this.viewPlanRepository.get(companyId, planId);
    } catch (error) {
      throw error;
    }
  };

  upgradePlan = async (companyId: number, clientId: string, productIds: string[]) => {
    try {
      return await this.upgradePlanRepository.get(companyId, clientId, productIds);
    } catch (error) {
      throw error;
    }
  };
}
