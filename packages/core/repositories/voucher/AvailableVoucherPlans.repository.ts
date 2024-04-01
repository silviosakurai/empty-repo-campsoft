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
  product,
  productType,
  productGroup,
  productGroupProduct,
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
import {
  AvailableProducts,
  PlanDetails,
  PlanProducts,
} from "@core/interfaces/repositories/voucher";

@injectable()
export class AvailableVoucherPlansRepository {
  constructor(
    @inject("Database") private readonly db: MySql2Database<typeof schema>
  ) {}

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
        status: sql<ProductVoucherStatus>`CASE 
          WHEN ${couponRescueItem.validade_ate} IS NOT NULL AND ${couponRescueItem.validade_ate} < ${validUntil} 
            THEN ${ProductVoucherStatus.EXPIRED}
          WHEN ${clientSignature.id_plano} IS NOT NULL AND ${clientSignature.recorrencia} = ${ClientSignatureRecorrencia.YES} 
            THEN ${ProductVoucherStatus.IN_USE} 
          WHEN ${clientSignature.id_plano} IS NOT NULL AND ${clientSignature.recorrencia} = ${ClientSignatureRecorrencia.NO} 
            THEN ${ProductVoucherStatus.IN_ADDITION}
          ELSE ${ProductVoucherStatus.ACTIVE}
        END`,
        current_expiration: sql<string | null>`CASE 
          WHEN ${clientSignature.recorrencia} = ${ClientSignatureRecorrencia.NO} THEN ${clientSignature.data_assinatura_ate}
          ELSE null
        END`,
        expiration_date: sql<string | null>`CASE 
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

    const enrichPromises = await this.enrichPlanAndProductGroupsPromises(
      tokenKeyData,
      result
    );

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
        status: sql<ProductVoucherStatus>`CASE 
          WHEN ${couponRescueItem.validade_ate} IS NOT NULL AND ${couponRescueItem.validade_ate} < ${validUntil} 
            THEN ${ProductVoucherStatus.EXPIRED}
          ELSE ${ProductVoucherStatus.ACTIVE}
        END`,
        current_expiration: sql<null>`null`,
        expiration_date: sql<string | null>`CASE 
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

    const enrichPromises = await this.enrichPlanAndProductGroupsPromises(
      tokenKeyData,
      result
    );

    return enrichPromises;
  }

  async fetchPlanProductDetails(
    tokenKeyData: ITokenKeyData,
    planId: number
  ): Promise<PlanProducts[]> {
    const result = await this.db
      .select({
        product_id: planItem.id_produto,
        status: product.status,
        name: product.produto,
        long_description: product.descricao,
        short_description: product.descricao_curta,
        marketing_phrases: product.frases_marketing,
        content_provider_name: product.conteudista_nome,
        slug: product.url_caminho,
        images: {
          main_image: product.imagem,
          icon: product.icon,
          logo: product.logo,
          background_image: product.imagem_background,
        },
        product_type: {
          product_type_id: productType.id_produto_tipo,
          product_type_name: productType.produto_tipo,
        },
      })
      .from(plan)
      .innerJoin(planItem, eq(plan.id_plano, planItem.id_plano))
      .innerJoin(product, eq(planItem.id_produto, product.id_produto))
      .innerJoin(
        productType,
        eq(product.id_produto_tipo, productType.id_produto_tipo)
      )
      .where(
        and(
          eq(plan.id_plano, planId),
          eq(plan.id_empresa, tokenKeyData.company_id)
        )
      )
      .execute();

    if (result.length === 0) {
      return [];
    }

    return result as PlanProducts[];
  }

  async fetchPlanProductGroupsDetails(
    tokenKeyData: ITokenKeyData,
    planId: number
  ) {
    const result = await this.db
      .select({
        product_group_id: productGroup.id_produto_grupo,
        name: productGroup.produto_grupo,
        quantity: productGroup.qtd_produtos_selecionaveis,
      })
      .from(plan)
      .innerJoin(planItem, eq(plan.id_plano, planItem.id_plano))
      .innerJoin(
        productGroup,
        eq(productGroup.id_produto_grupo, planItem.id_produto_grupo)
      )
      .leftJoin(
        productGroupProduct,
        eq(productGroup.id_produto_grupo, productGroupProduct.id_produto_grupo)
      )
      .where(
        and(
          eq(plan.id_plano, planId),
          eq(plan.id_empresa, tokenKeyData.company_id)
        )
      )
      .groupBy(productGroupProduct.id_produto_grupo)
      .execute();

    if (result.length === 0) {
      return [];
    }

    const enrichPromises =
      await this.enrichAvailableProductsByProductGroupsPromises(result);

    return enrichPromises;
  }

  async fetchPlanProductGroupsProductsByProductGroupId(
    productGroupId: number
  ): Promise<PlanProducts[]> {
    const result = await this.db
      .select({
        product_id: productGroupProduct.id_produto,
        status: product.status,
        name: product.produto,
        long_description: product.descricao,
        short_description: product.descricao_curta,
        marketing_phrases: product.frases_marketing,
        content_provider_name: product.conteudista_nome,
        slug: product.url_caminho,
        images: {
          main_image: product.imagem,
          icon: product.icon,
          logo: product.logo,
          background_image: product.imagem_background,
        },
        product_type: {
          product_type_id: productType.id_produto_tipo,
          product_type_name: productType.produto_tipo,
        },
      })
      .from(productGroupProduct)
      .innerJoin(
        product,
        eq(product.id_produto, productGroupProduct.id_produto)
      )
      .innerJoin(
        productType,
        eq(product.id_produto_tipo, productType.id_produto_tipo)
      )
      .where(eq(productGroupProduct.id_produto_grupo, productGroupId))
      .execute();

    if (result.length === 0) {
      return [];
    }

    return result as PlanProducts[];
  }

  async enrichAvailableProductsByProductGroupsPromises(
    result: AvailableProducts[]
  ) {
    const enrichProductGroupsPromises = result.map(
      async (productGroups: AvailableProducts) => ({
        ...productGroups,
        available_products:
          await this.fetchPlanProductGroupsProductsByProductGroupId(
            productGroups.product_group_id
          ),
      })
    );

    const enrichedProductGroups = await Promise.all(
      enrichProductGroupsPromises
    );

    return enrichedProductGroups;
  }

  async enrichPlanAndProductGroupsPromises(
    tokenKeyData: ITokenKeyData,
    result: PlanDetails[]
  ) {
    const enrichPlanPromises = result.map(async (plan: PlanDetails) => ({
      ...plan,
      plan_products: await this.fetchPlanProductDetails(
        tokenKeyData,
        plan.plan_id
      ),
      product_groups: await this.fetchPlanProductGroupsDetails(
        tokenKeyData,
        plan.plan_id
      ),
    }));

    const enrichedPlans = await Promise.all(enrichPlanPromises);

    return enrichedPlans;
  }
}
