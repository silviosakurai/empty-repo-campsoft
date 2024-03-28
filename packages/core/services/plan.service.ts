import { injectable } from "tsyringe";
import { PlanListerRepository } from "@core/repositories/plan/PlanLister.repository";
import { PlanViewerRepository } from "@core/repositories/plan/PlanViewer.repository";
import { ListPlanRequest } from "@core/useCases/plan/dtos/ListPlanRequest.dto";
import { PlanUpgraderRepository } from "@core/repositories/plan/PlanUpgrader.repository";

@injectable()
export class PlanService {
  constructor(
    private readonly planListerRepository: PlanListerRepository,
    private readonly planViewerRepository: PlanViewerRepository,
    private readonly planUpgraderRepository: PlanUpgraderRepository
  ) {}

  list = async (companyId: number, query: ListPlanRequest) => {
    try {
      return await this.planListerRepository.list(companyId, query);
    } catch (error) {
      throw error;
    }
  };

  view = async (companyId: number, planId: number) => {
    try {
      return await this.planViewerRepository.get(companyId, planId);
    } catch (error) {
      throw error;
    }
  };

  upgrade = async (
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
