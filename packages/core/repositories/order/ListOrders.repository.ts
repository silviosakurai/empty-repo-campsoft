import * as schema from "@core/models";
import { MySql2Database } from "drizzle-orm/mysql2";
import { inject, injectable } from "tsyringe";
import {
  order,
  orderStatus,
  orderItem,
  orderPayment,
  orderPaymentMethod,
  orderPaymentStatus,
  plan,
  planPrice,
  product,
  productType,
  productGroup,
  planItem,
  productGroupProduct,
} from "@core/models";
import { ITokenKeyData } from "@core/common/interfaces/ITokenKeyData";
import { ITokenJwtData } from "@core/common/interfaces/ITokenJwtData";
import { and, count, eq, sql } from "drizzle-orm";
import {
  ListOrder,
  OrderPayments,
  PlanDetails,
} from "@core/interfaces/repositories/order";
import { OrderPaymentsMethodsEnum } from "@core/common/enums/models/order";
import { PlanVisivelSite } from "@core/common/enums/models/plan";
import {
  AvailableProducts,
  PlanProducts,
} from "@core/interfaces/repositories/voucher";
import { ListOrderResponse } from "@core/useCases/order/dtos/ListOrderResponse.dto";
import { ListOrderRequestDto } from "@core/useCases/order/dtos/ListOrderRequest.dto";

@injectable()
export class ListOrdersRepository {
  private db: MySql2Database<typeof schema>;

  constructor(
    @inject("Database") mySql2Database: MySql2Database<typeof schema>
  ) {
    this.db = mySql2Database;
  }

  async list(
    input: ListOrderRequestDto,
    tokenKeyData: ITokenKeyData,
    tokenJwtData: ITokenJwtData
  ): Promise<ListOrderResponse[]> {
    const offset = input.current_page
      ? (input.current_page - 1) * input.per_page
      : 0;

    const result = await this.db
      .select({
        order_id: sql<string>`BIN_TO_UUID(${order.id_pedido})`,
        client_id: sql<string>`BIN_TO_UUID(${order.id_cliente})`,
        seller_id: sql<string>`BIN_TO_UUID(${order.id_vendedor})`,
        status: orderStatus.pedido_status,
        totals: {
          subtotal_price: sql`${order.valor_preco}`.mapWith(Number),
          discount_item_value: sql`${order.valor_desconto}`.mapWith(Number),
          discount_coupon_value: sql<number>`CASE
            WHEN ${orderItem.valor_cupom} IS NOT NULL 
              THEN SUM(${orderItem.valor_cupom}) 
            ELSE 0
          END`.mapWith(Number),
          discount_product_value: sql<number>`CASE
            WHEN ${orderItem.desconto_produto} IS NOT NULL 
              THEN SUM(${orderItem.desconto_produto}) 
            ELSE 0
          END`.mapWith(Number),
          discount_percentage: sql<number>`CASE 
            WHEN ${order.valor_total} > 0 
              THEN ROUND((${order.valor_desconto} / ${order.valor_total}) * 100)
            ELSE 0 
          END`.mapWith(Number),
          total: sql`${order.valor_total}`.mapWith(Number),
        },
        installments: {
          installment: order.pedido_parcelas_vezes,
          value: order.pedido_parcelas_valor,
        },
        created_at: order.created_at,
        updated_at: order.updated_at,
      })
      .from(order)
      .innerJoin(
        orderStatus,
        eq(orderStatus.id_pedido_status, order.id_pedido_status)
      )
      .leftJoin(orderItem, eq(orderItem.id_pedido, order.id_pedido))
      .where(
        and(
          eq(order.id_empresa, tokenKeyData.company_id),
          eq(order.id_cliente, sql`UUID_TO_BIN(${tokenJwtData.clientId})`)
        )
      )
      .limit(input.per_page)
      .offset(offset)
      .groupBy(order.id_pedido)
      .execute();

    if (result.length === 0) {
      return [];
    }

    const enrichPromises = await this.enrichPaymentsAndPlansPromises(
      tokenKeyData,
      result
    );

    return enrichPromises as ListOrderResponse[];
  }

  async countTotal(
    tokenKeyData: ITokenKeyData,
    tokenJwtData: ITokenJwtData
  ): Promise<number> {
    const countResult = await this.db
      .select({
        count: count(),
      })
      .from(order)
      .where(
        and(
          eq(order.id_empresa, tokenKeyData.company_id),
          eq(order.id_cliente, sql`UUID_TO_BIN(${tokenJwtData.clientId})`)
        )
      )
      .execute();

    return countResult[0].count;
  }

  private async fetchOrderPayments(orderId: string): Promise<OrderPayments[]> {
    const result = await this.db
      .select({
        type: orderPaymentMethod.pedido_pag_metodo,
        status: orderPaymentStatus.pedido_pagamento_status,
        credit_card: {
          brand: orderPayment.pag_cc_tipo,
          number: orderPayment.pag_cc_numero_cartao,
          credit_card_id: orderPayment.pag_cc_instantbuykey,
        },
        voucher: orderPayment.pag_hash,
        boleto: {
          url: sql<string>`CASE WHEN ${orderPayment.id_pedido_pag_metodo} = ${OrderPaymentsMethodsEnum.BOLETO} 
            THEN COALESCE(JSON_EXTRACT(${orderPayment.pag_info_adicional},'$.url'), NULL)
            ELSE NULL
          END`,
          code: sql<string>`CASE WHEN ${orderPayment.id_pedido_pag_metodo} = ${OrderPaymentsMethodsEnum.BOLETO} 
            THEN COALESCE(JSON_EXTRACT(${orderPayment.pag_info_adicional},'$.line'), NULL)
            ELSE NULL
          END`,
        },
        pix: {
          url: sql<string>`CASE WHEN ${orderPayment.id_pedido_pag_metodo} = ${OrderPaymentsMethodsEnum.PIX} 
            THEN COALESCE(JSON_EXTRACT(${orderPayment.pag_info_adicional},'$.qr_code_url'), NULL)
            ELSE NULL
          END`,
          code: sql<string>`CASE WHEN ${orderPayment.id_pedido_pag_metodo} = ${OrderPaymentsMethodsEnum.PIX} 
            THEN COALESCE(JSON_EXTRACT(${orderPayment.pag_info_adicional},'$.qr_code'), NULL)
            ELSE NULL
          END`,
          expire_at: sql<string>`CASE WHEN ${orderPayment.id_pedido_pag_metodo} = ${OrderPaymentsMethodsEnum.PIX} 
            THEN COALESCE(JSON_EXTRACT(${orderPayment.pag_info_adicional},'$.expires_at'), NULL)
            ELSE NULL
          END`,
        },
        cycle: orderPayment.assinatura_ciclo,
        created_at: orderPayment.created_at,
        updated_at: orderPayment.updated_at,
      })
      .from(orderPayment)
      .innerJoin(
        orderPaymentMethod,
        eq(
          orderPaymentMethod.id_pedido_pag_metodo,
          orderPayment.id_pedido_pag_metodo
        )
      )
      .innerJoin(
        orderPaymentStatus,
        eq(
          orderPaymentStatus.id_pedido_pagamento_status,
          orderPayment.id_pedido_pagamento_status
        )
      )
      .where(and(eq(orderPayment.id_pedido, sql`UUID_TO_BIN(${orderId})`)))
      .execute();

    if (result.length === 0) {
      return [];
    }

    return result as OrderPayments[];
  }

  private async fetchOrderPlans(tokenKeyData: ITokenKeyData, orderId: string) {
    const result = await this.db
      .select({
        plan_id: plan.id_plano,
        status: plan.status,
        visible_site: sql<boolean>`CASE 
          WHEN ${plan.visivel_site} = ${PlanVisivelSite.YES} THEN true
          ELSE false
        END`,
        business_id: plan.id_empresa,
        plan: plan.plano,
        image: plan.imagem,
        description: plan.descricao,
        short_description: plan.descricao_curta,
      })
      .from(plan)
      .innerJoin(orderItem, eq(orderItem.id_plano, plan.id_plano))
      .innerJoin(order, eq(order.id_pedido, orderItem.id_pedido))
      .innerJoin(planPrice, eq(planPrice.id_plano, plan.id_plano))
      .where(
        and(
          eq(order.id_pedido, sql`UUID_TO_BIN(${orderId})`),
          eq(plan.id_empresa, tokenKeyData.company_id)
        )
      )
      .groupBy(plan.id_plano)
      .execute();

    if (result.length === 0) {
      return [];
    }

    const enrichPromises = await this.enrichPlanAndProductGroupsPromises(
      tokenKeyData,
      result
    );

    return enrichPromises;
  }

  private async fetchPlanProductDetails(
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

  private async fetchPlanProductGroupsDetails(
    tokenKeyData: ITokenKeyData,
    planId: number
  ) {
    const result = await this.db
      .select({
        product_group_id: productGroup.id_produto_grupo,
        name: productGroup.produto_grupo,
        quantity: sql<number>`COUNT(${productGroupProduct.id_produto_grupo})`,
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

  private async fetchPlanProductGroupsProductsByProductGroupId(
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

  private async fetchPricesByPlan(planId: number) {
    const result = await this.db
      .select({
        price: planPrice.preco,
        discount_value: planPrice.desconto_valor,
        discount_percentage: planPrice.desconto_porcentagem,
        price_with_discount: planPrice.preco_desconto,
      })
      .from(planPrice)
      .where(and(eq(planPrice.id_plano, planId)))
      .execute();

    if (result.length === 0) {
      return [];
    }

    return result;
  }

  private async enrichPaymentsAndPlansPromises(
    tokenKeyData: ITokenKeyData,
    result: ListOrder[]
  ) {
    const enrichPaymentsAndPlansPromises = result.map(
      async (orderPayments: ListOrder) => ({
        ...orderPayments,
        payments: await this.fetchOrderPayments(orderPayments.order_id),
        plans: await this.fetchOrderPlans(tokenKeyData, orderPayments.order_id),
      })
    );

    const enrichedPaymentsAndPlans = await Promise.all(
      enrichPaymentsAndPlansPromises
    );

    return enrichedPaymentsAndPlans;
  }

  private async enrichPlanAndProductGroupsPromises(
    tokenKeyData: ITokenKeyData,
    result: PlanDetails[]
  ) {
    const enrichPlanPromises = result.map(async (plan: PlanDetails) => ({
      ...plan,
      prices: await this.fetchPricesByPlan(plan.plan_id),
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

  private async enrichAvailableProductsByProductGroupsPromises(
    result: AvailableProducts[]
  ) {
    const enrichProductGroupsPromises = result.map(
      async (productGroups: AvailableProducts) => ({
        ...productGroups,
        selected_products:
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
}
