import { injectable } from "tsyringe";
import { PlanListerRepository } from "@core/repositories/plan/PlanLister.repository";
import { PlanViewerRepository } from "@core/repositories/plan/PlanViewer.repository";
import { ListPlanRequest } from "@core/useCases/plan/dtos/ListPlanRequest.dto";
import { PlanUpgraderRepository } from "@core/repositories/plan/PlanUpgrader.repository";
import { PlanPriceListerRepository } from "@core/repositories/plan/PlanPriceLister.repository";
import { ITokenKeyData } from "@core/common/interfaces/ITokenKeyData";
import { PlanProductGroupDetailsListerRepository } from "@core/repositories/plan/PlanProductGroupDetailsLister.repository";
import { PlanProduct } from "@core/interfaces/repositories/plan";
import { PlanListerOrderRepository } from "@core/repositories/plan/PlanListerOrder.repository";
import { CreateOrderRequestDto } from "@core/useCases/order/dtos/CreateOrderRequest.dto";

@injectable()
export class PlanService {
  constructor(
    private readonly planListerRepository: PlanListerRepository,
    private readonly planViewerRepository: PlanViewerRepository,
    private readonly planUpgraderRepository: PlanUpgraderRepository,
    private readonly planPriceListerRepository: PlanPriceListerRepository,
    private readonly planProductGroupDetailsListerRepository: PlanProductGroupDetailsListerRepository,
    private readonly planListerOrderRepository: PlanListerOrderRepository
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

  listByPlanOrder = async (
    tokenKeyData: ITokenKeyData,
    payload: CreateOrderRequestDto
  ) => {
    return this.planListerOrderRepository.listByPlanOrder(
      tokenKeyData,
      payload
    );
  };

  isPlanProductAndProductGroups = async (
    tokenKeyData: ITokenKeyData,
    payload: CreateOrderRequestDto
  ): Promise<boolean> => {
    const selectedProducts = payload.plan.selected_products ?? [];

    if (selectedProducts.length === 0) {
      return true;
    }

    const planProductAndProductGroups =
      await this.findPlanProductAndProductGroups(
        tokenKeyData,
        payload.plan.plan_id,
        selectedProducts
      );

    if (
      !planProductAndProductGroups ||
      planProductAndProductGroups.length === 0
    ) {
      return false;
    }

    const productIds = planProductAndProductGroups.map((item) =>
      item.product_id.toString()
    );

    const allProductsSelected = selectedProducts.every((selected) =>
      productIds.includes(selected.toString())
    );

    return allProductsSelected;
  };

  listPlanByOrderComplete = async (
    tokenKeyData: ITokenKeyData,
    payload: CreateOrderRequestDto
  ): Promise<string[] | null> => {
    const productsOrderSet = new Set<string>();

    payload.plan.selected_products?.forEach((product) =>
      productsOrderSet.add(product)
    );

    if (productsOrderSet.size === 0) {
      const planList = await this.listByPlanOrder(tokenKeyData, payload);

      if (!planList || planList.length === 0) {
        return null;
      }

      planList.forEach((item) => productsOrderSet.add(item.product_id));
    }

    payload.products?.forEach((product) => productsOrderSet.add(product));

    return Array.from(productsOrderSet);
  };
}