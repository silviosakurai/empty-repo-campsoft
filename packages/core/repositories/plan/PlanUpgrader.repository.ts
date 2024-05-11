import * as schema from "@core/models";
import { MySql2Database } from "drizzle-orm/mysql2";
import { inject, injectable } from "tsyringe";
import { clientSignature, clientProductSignature } from "@core/models";
import { eq, and, sql } from "drizzle-orm";
import { Plan } from "@core/common/enums/models/plan";
import { PlanListerRepository } from "./PlanLister.repository";
import { PlanItemListerRepository } from "./PlanItemLister.repository";
import { SignatureStatus } from "@core/common/enums/models/signature";
import {
  UpgradePlanRepositoryDTO,
  UpgradePlanRepositoryResponse,
} from "@core/interfaces/repositories/plan";

@injectable()
export class PlanUpgraderRepository {
  constructor(
    @inject("Database") private readonly db: MySql2Database<typeof schema>,
    private readonly planListerRepository: PlanListerRepository,
    private readonly planItemListerRepository: PlanItemListerRepository
  ) {}

  async get(
    companyId: number,
    clientId: string,
    productIds: string[]
  ): Promise<UpgradePlanRepositoryResponse | null> {
    const result: UpgradePlanRepositoryDTO[] = await this.db
      .select({
        client_id: sql`BIN_TO_UUID(${clientSignature.id_cliente})`,
        client_signature_id: sql`BIN_TO_UUID(${clientSignature.id_assinatura_cliente})`,
        status: clientSignature.id_assinatura_status,
        plan_id: clientSignature.id_plano,
      })
      .from(clientSignature)
      .innerJoin(
        clientProductSignature,
        eq(
          clientProductSignature.id_assinatura_cliente,
          clientSignature.id_assinatura_cliente
        )
      )
      .where(
        and(
          eq(clientSignature.id_cliente, sql`UUID_TO_BIN(${clientId})`),
          eq(clientSignature.id_assinatura_status, SignatureStatus.ACTIVE),
          eq(clientSignature.id_parceiro, companyId)
        )
      )
      .execute();

    if (!result.length) {
      return null;
    }

    const uniquePlans = [...new Set(result.map((item) => item.plan_id))].map(
      (planId) => ({ plan_id: planId })
    );

    return this.getPlansToUpgrade(
      uniquePlans[0].plan_id,
      companyId,
      productIds
    );
  }

  private getPlansToUpgrade = async (
    planId: number,
    companyId: number,
    productIdsToFilter: string[]
  ) => {
    const plans =
      await this.planListerRepository.listWithoutPagination(companyId);

    const actualPlan = plans.find((plan) => plan.plan_id === planId);

    if (!actualPlan) {
      return {
        plans: [],
        planItems: [],
      };
    }

    const planItems = await this.planItemListerRepository.listByPlanId(
      actualPlan.plan_id
    );

    const plansToUpgrade = plans.filter((plan) => plan.plan_id !== planId);

    let plansToUpgradeWithProductsToFilter: Plan[] = plansToUpgrade;

    if (productIdsToFilter.length > 0) {
      plansToUpgradeWithProductsToFilter = plansToUpgrade.filter((plan) => {
        const plansWithProductsFiltered = plan.products.filter((product) =>
          productIdsToFilter.includes(product.product_id)
        );

        if (plansWithProductsFiltered.length > 0) {
          return plan;
        }
      });
    }

    return {
      plans: plansToUpgradeWithProductsToFilter,
      planItems,
    };
  };
}
