import { injectable } from "tsyringe";
import { PlanListerRepository } from "@core/repositories/plan/PlanLister.repository";
import { PlanViewerRepository } from "@core/repositories/plan/PlanViewer.repository";
import { ListPlanRequest } from "@core/useCases/plan/dtos/ListPlanRequest.dto";
import { PlanUpgraderRepository } from "@core/repositories/plan/PlanUpgrader.repository";
import { PlanPriceListerRepository } from "@core/repositories/plan/PlanPriceLister.repository";
import { ITokenKeyData } from "@core/common/interfaces/ITokenKeyData";
import { PlanProductGroupDetailsListerRepository } from "@core/repositories/plan/PlanProductGroupDetailsLister.repository";
import {
  PlanPriceOrder,
  PlanProduct,
} from "@core/interfaces/repositories/plan";

@injectable()
export class PlanService {
  constructor(
    private readonly planListerRepository: PlanListerRepository,
    private readonly planViewerRepository: PlanViewerRepository,
    private readonly planUpgraderRepository: PlanUpgraderRepository,
    private readonly planPriceListerRepository: PlanPriceListerRepository,
    private readonly planProductGroupDetailsListerRepository: PlanProductGroupDetailsListerRepository
  ) {}

  list = async (companyId: number, query: ListPlanRequest) => {
    return this.planListerRepository.list(companyId, query);
  };

  view = async (companyId: number, planId: number) => {
    return this.planViewerRepository.get(companyId, planId);
  };

  upgrade = async (
    companyId: number,
    clientId: string,
    productIds: string[]
  ) => {
    return this.planUpgraderRepository.get(companyId, clientId, productIds);
  };

  findPriceByPlanIdAndMonth = async (planId: number, month: number) => {
    return this.planPriceListerRepository.findPriceByPlanIdAndMonth(
      planId,
      month
    );
  };

  findPlanProductAndProductGroups = async (
    tokenKeyData: ITokenKeyData,
    planId: number,
    selectedProducts: string[]
  ): Promise<PlanProduct[]> => {
    return this.planProductGroupDetailsListerRepository.findPlanProductAndProductGroups(
      tokenKeyData,
      planId,
      selectedProducts
    );
  };

  findPriceByPlanIdAndMonthNotProducts = async (
    planId: number,
    month: number,
    selectedProducts: string[]
  ): Promise<PlanPriceOrder[]> => {
    return this.planPriceListerRepository.findPriceByPlanIdAndMonthNotProducts(
      planId,
      month,
      selectedProducts
    );
  };
}
