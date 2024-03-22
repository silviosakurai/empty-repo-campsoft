import { injectable, inject } from "tsyringe";
import * as schema from "@core/models";
import {
  plan,
  couponRescueItem,
  couponRescueCode,
  couponRescue,
  clientSignature,
  order,
  planItem,
} from "@core/models";
import { MySql2Database } from "drizzle-orm/mysql2";
import { and, eq, sql } from "drizzle-orm";
import { ITokenKeyData } from "@core/common/interfaces/ITokenKeyData";
import { currentTime } from "@core/common/functions/currentTime";
import { PlanVisivelSite } from "@core/common/enums/models/plan";
import { ProductVoucherStatus } from "@core/common/enums/models/product";
import {
  CouponRescueItemDeleted,
  CouponRescueItemTypeTime,
} from "@core/common/enums/models/coupon";
import { Status } from "@core/common/enums/Status";
import { ITokenJwtData } from "@core/common/interfaces/ITokenJwtData";
import {
  ClientSignatureRecorrencia,
  SignatureStatus,
} from "@core/common/enums/models/signature";

@injectable()
export class AvailableVoucherPlansRepository {
  private db: MySql2Database<typeof schema>;

  constructor(
    @inject("Database") mySql2Database: MySql2Database<typeof schema>
  ) {
    this.db = mySql2Database;
  }

  async listVoucherEligiblePlansSignatureUser(
    tokenKeyData: ITokenKeyData,
    tokenJwtData: ITokenJwtData,
    voucher: string
  ) {
    const validUntil = currentTime();

    const result = await this.db
      .select({
        plan_id: plan.id_plano,
        visible_site: sql<boolean>`CASE 
          WHEN ${plan.visivel_site} = ${PlanVisivelSite.YES} THEN true
          ELSE false
        END`,
        business_id: plan.id_empresa,
        plan: plan.plano,
        image: plan.imagem,
        description: plan.descricao,
        short_description: plan.descricao_curta,
        status: sql`CASE 
          WHEN ${couponRescueItem.validade_ate} IS NOT NULL AND ${couponRescueItem.validade_ate} < ${validUntil} 
            THEN ${ProductVoucherStatus.EXPIRED}
          WHEN ${clientSignature.id_plano} IS NOT NULL AND ${clientSignature.recorrencia} = ${ClientSignatureRecorrencia.YES} 
            THEN ${ProductVoucherStatus.IN_USE} 
          WHEN ${clientSignature.id_plano} IS NOT NULL AND ${clientSignature.recorrencia} = ${ClientSignatureRecorrencia.NO} 
            THEN ${ProductVoucherStatus.IN_ADDITION}
          ELSE ${ProductVoucherStatus.ACTIVE}
        END`,
        current_expiration: sql`CASE 
          WHEN ${clientSignature.recorrencia} = ${ClientSignatureRecorrencia.NO} THEN ${clientSignature.data_assinatura_ate}
          ELSE null
        END`,
        expiration_date: sql`CASE 
          WHEN ${clientSignature.recorrencia} = ${ClientSignatureRecorrencia.YES} THEN 
            CASE 
              WHEN ${couponRescueItem.tempo_tipo} = ${CouponRescueItemTypeTime.MONTH} 
                THEN DATE_ADD(CURRENT_DATE(), INTERVAL ${couponRescueItem.tempo} MONTH)
              WHEN ${couponRescueItem.tempo_tipo} = ${CouponRescueItemTypeTime.DAY} 
                THEN DATE_ADD(CURRENT_DATE(), INTERVAL ${couponRescueItem.tempo} DAY)
              ELSE CURRENT_DATE()
            END
          WHEN ${clientSignature.recorrencia} = ${ClientSignatureRecorrencia.NO} THEN 
            CASE 
              WHEN ${couponRescueItem.tempo_tipo} = ${CouponRescueItemTypeTime.MONTH} 
                THEN DATE_ADD(COALESCE(${clientSignature.data_assinatura_ate}, CURRENT_DATE()), INTERVAL ${couponRescueItem.tempo} MONTH)
              WHEN ${couponRescueItem.tempo_tipo} = ${CouponRescueItemTypeTime.DAY} 
                THEN DATE_ADD(COALESCE(${clientSignature.data_assinatura_ate}, CURRENT_DATE()), INTERVAL ${couponRescueItem.tempo} DAY)
              ELSE 
                COALESCE(${clientSignature.data_assinatura_ate}, CURRENT_DATE())
            END
          ELSE null
        END`,
        redemption_date: clientSignature.data_inicio,
      })
      .from(clientSignature)
      .innerJoin(order, eq(clientSignature.id_pedido, order.id_pedido))
      .innerJoin(
        couponRescueCode,
        eq(order.cupom_resgatar_codigo, couponRescueCode.cupom_resgatar_codigo)
      )
      .innerJoin(
        couponRescueItem,
        eq(
          couponRescueCode.id_cupom_resgatar,
          couponRescueItem.id_cupom_resgatar
        )
      )
      .innerJoin(plan, eq(couponRescueItem.id_plano, plan.id_plano))
      .innerJoin(planItem, eq(plan.id_plano, planItem.id_plano))
      .where(
        and(
          eq(
            clientSignature.id_cliente,
            sql`UUID_TO_BIN(${tokenJwtData.clientId})`
          ),
          eq(clientSignature.id_assinatura_status, SignatureStatus.ACTIVE),
          eq(order.cupom_resgatar_codigo, voucher),
          eq(clientSignature.id_empresa, tokenKeyData.company_id),
          eq(couponRescueItem.deleted, CouponRescueItemDeleted.NO),
          eq(plan.status, Status.ACTIVE)
        )
      )
      .groupBy(plan.id_plano)
      .execute();

    if (result.length === 0) {
      return null;
    }

    const enrichPromises =
      await this.enrichPlanAndProductGroupsPromises(result);

    return enrichPromises;
  }

  async listVoucherEligiblePlansNotSignatureUser(
    tokenKeyData: ITokenKeyData,
    voucher: string
  ) {
    const validUntil = currentTime();

    const result = await this.db
      .select({
        plan_id: plan.id_plano,
        visible_site: sql<boolean>`CASE 
          WHEN ${plan.visivel_site} = ${PlanVisivelSite.YES} THEN true
          ELSE false
        END`,
        business_id: plan.id_empresa,
        plan: plan.plano,
        image: plan.imagem,
        description: plan.descricao,
        short_description: plan.descricao_curta,
        status: sql`CASE 
          WHEN ${couponRescueItem.validade_ate} IS NOT NULL AND ${couponRescueItem.validade_ate} < ${validUntil} 
            THEN ${ProductVoucherStatus.EXPIRED}
          ELSE ${ProductVoucherStatus.ACTIVE}
        END`,
        current_expiration: sql<null>`null`,
        expiration_date: sql`CASE 
          WHEN ${couponRescueItem.tempo_tipo} = ${CouponRescueItemTypeTime.MONTH} 
            THEN DATE_ADD(CURRENT_DATE(), INTERVAL ${couponRescueItem.tempo} MONTH)
          WHEN ${couponRescueItem.tempo_tipo} = ${CouponRescueItemTypeTime.DAY} 
            THEN DATE_ADD(CURRENT_DATE(), INTERVAL ${couponRescueItem.tempo} DAY)
          ELSE 
            CURRENT_DATE()
        END`,
        redemption_date: sql<null>`null`,
      })
      .from(plan)
      .innerJoin(couponRescueItem, eq(plan.id_plano, couponRescueItem.id_plano))
      .innerJoin(
        couponRescueCode,
        eq(
          couponRescueItem.id_cupom_resgatar,
          couponRescueCode.id_cupom_resgatar
        )
      )
      .innerJoin(
        couponRescue,
        eq(couponRescue.id_cupom_resgatar, couponRescueCode.id_cupom_resgatar)
      )
      .where(
        and(
          eq(couponRescueCode.cupom_resgatar_codigo, voucher),
          eq(couponRescueItem.deleted, CouponRescueItemDeleted.NO),
          eq(plan.status, Status.ACTIVE),
          eq(couponRescue.id_empresa, tokenKeyData.company_id)
        )
      )
      .groupBy(plan.id_plano)
      .execute();

    if (result.length === 0) {
      return null;
    }

    return result;
  }

  async enrichPlanAndProductGroupsPromises(result: any) {
    const enrichPlanPromises = result.map(async (plan: any) => ({
      ...plan,
      plan_products: await this.fetchPlanProductDetails(plan.plan_id),
    }));

    const enrichedPlans = await Promise.all(enrichPlanPromises);

    return enrichedPlans;
  }
}
