import { injectable } from "tsyringe";
import { ListPlanRepository } from "@core/repositories/plan/ListPlan.repository";
import { ViewPlanRepository } from "@core/repositories/plan/ViewPlan.repository";
import { ListPlanRequest } from "@core/useCases/plan/dtos/ListPlanRequest.dto";

@injectable()
export class PlanService {
  private listPlanRepository: ListPlanRepository;
  private viewPlanRepository: ViewPlanRepository;

  constructor(
    listPlanRepository: ListPlanRepository,
    viewPlanRepository: ViewPlanRepository,
  ) {
    this.listPlanRepository = listPlanRepository;
    this.viewPlanRepository = viewPlanRepository;
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
}
