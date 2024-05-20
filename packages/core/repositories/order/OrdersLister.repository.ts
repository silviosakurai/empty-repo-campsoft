import * as schema from "@core/models";
import { MySql2Database } from "drizzle-orm/mysql2";
import { inject, injectable } from "tsyringe";
import {
  order,
  orderStatus,
  orderPayment,
  orderPaymentMethod,
  orderPaymentStatus,
  plan,
  planPrice,
  planPartner,
  product,
  productType,
  productGroup,
  planItem,
  productGroupProduct,
  clientSignature,
  signatureStatus,
  clientCards,
  financeSplitRules,
} from "@core/models";
import { ITokenKeyData } from "@core/common/interfaces/ITokenKeyData";
import { ITokenJwtData } from "@core/common/interfaces/ITokenJwtData";
import { and, count, eq, sql } from "drizzle-orm";
import {
  ListOrder,
  ListOrderById,
  OrderPayments,
  PlanDetails,
} from "@core/interfaces/repositories/order";
import { PlanVisivelSite } from "@core/common/enums/models/plan";
import {
  AvailableProducts,
  PlanProducts,
} from "@core/interfaces/repositories/voucher";
import {
  ListOrderResponse,
  ListOrderWithCurrenceResponse,
} from "@core/useCases/order/dtos/ListOrderResponse.dto";
import { ListOrderRequestDto } from "@core/useCases/order/dtos/ListOrderRequest.dto";
import { enrichPaymentOrder } from "@core/common/functions/enrichPaymentOrder";

@injectable()
export class OrdersListerRepository {
  constructor(
    @inject("Database") private readonly db: MySql2Database<typeof schema>
  ) {}

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
          discount_coupon_value:
            sql<number>`COALESCE(${order.valor_cupom}, 0)`.mapWith(Number),
          discount_product_value:
            sql<number>`COALESCE(${order.desconto_produto}, 0)`.mapWith(Number),
          discount_percentage: sql<number>`CASE 
            WHEN ${order.valor_total} > 0 AND ${order.valor_desconto} IS NOT NULL
              THEN ROUND((${order.valor_desconto} / ${order.valor_total}) * 100, 2)
            ELSE 0 
          END`.mapWith(Number),
          total: sql`${order.valor_total}`.mapWith(Number),
        },
        installments: {
          installment: order.pedido_parcelas_vezes,
          value: sql`${order.pedido_parcelas_valor}`.mapWith(Number),
        },
        created_at: order.created_at,
        updated_at: order.updated_at,
      })
      .from(order)
      .innerJoin(
        orderStatus,
        eq(orderStatus.id_pedido_status, order.id_pedido_status)
      )
      .where(
        and(
          eq(order.id_parceiro, tokenKeyData.id_parceiro),
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

  async listWithRecurrence(
    tokenKeyData: ITokenKeyData,
    tokenJwtData: ITokenJwtData
  ): Promise<ListOrderWithCurrenceResponse[]> {
    const result = await this.db
      .select({
        order_id: sql<string>`BIN_TO_UUID(${order.id_pedido})`,
        client_id: sql<string>`BIN_TO_UUID(${order.id_cliente})`,
        seller_id: sql<string>`BIN_TO_UUID(${order.id_vendedor})`,
        status: orderStatus.pedido_status,
        totals: {
          subtotal_price: sql`${order.valor_preco}`.mapWith(Number),
          discount_item_value: sql`${order.valor_desconto}`.mapWith(Number),
          discount_coupon_value:
            sql<number>`COALESCE(${order.valor_cupom}, 0)`.mapWith(Number),
          discount_product_value:
            sql<number>`COALESCE(${order.desconto_produto}, 0)`.mapWith(Number),
          discount_percentage: sql<number>`CASE 
            WHEN ${order.valor_total} > 0 AND ${order.valor_desconto} IS NOT NULL
              THEN ROUND((${order.valor_desconto} / ${order.valor_total}) * 100, 2)
            ELSE 0 
          END`.mapWith(Number),
          total: sql`${order.valor_total}`.mapWith(Number),
        },
        installments: {
          installment: order.pedido_parcelas_vezes,
          value: sql`${order.pedido_parcelas_valor}`.mapWith(Number),
        },
        signature: {
          status_id: signatureStatus.id_assinatura_status,
          status: signatureStatus.assinatura_status,
          validity: clientSignature.data_inicio,
          origin: financeSplitRules.regra_nome,
          recurrence: sql<string>`CASE ${order.recorrencia_periodo}
            WHEN 1 THEN 'Mensal'
            WHEN 2 THEN 'Bimestral'
            WHEN 3 THEN 'Trimestral'
            WHEN 6 THEN 'Semestral'
            WHEN 12 THEN 'Anual' 
            ELSE CONCAT(${order.recorrencia_periodo}, ' meses')
          END`,
        },
        created_at: order.created_at,
        updated_at: order.updated_at,
      })
      .from(order)
      .innerJoin(
        orderStatus,
        eq(orderStatus.id_pedido_status, order.id_pedido_status)
      )
      .leftJoin(clientSignature, eq(clientSignature.id_pedido, order.id_pedido))
      .leftJoin(
        signatureStatus,
        eq(
          signatureStatus.id_assinatura_status,
          clientSignature.id_assinatura_status
        )
      )
      .leftJoin(
        financeSplitRules,
        eq(
          financeSplitRules.id_financeiro_split_regras,
          order.id_financeiro_split_regra
        )
      )
      .where(
        and(
          eq(order.id_parceiro, tokenKeyData.id_parceiro),
          eq(order.id_cliente, sql`UUID_TO_BIN(${tokenJwtData.clientId})`)
        )
      )
      .execute();

    if (result.length === 0) {
      return [];
    }

    const enrichPromises = await this.enrichPaymentsAndPlansPromises(
      tokenKeyData,
      result
    );

    return enrichPromises as ListOrderWithCurrenceResponse[];
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
          eq(order.id_parceiro, tokenKeyData.id_parceiro),
          eq(order.id_cliente, sql`UUID_TO_BIN(${tokenJwtData.clientId})`)
        )
      )
      .execute();

    if (!countResult?.length) {
      return 0;
    }

    return countResult[0].count;
  }

  private async fetchOrderPayments(orderId: string): Promise<OrderPayments[]> {
    const result = await this.db
      .select({
        type_id: orderPayment.id_pedido_pag_metodo,
        type: orderPaymentMethod.pedido_pag_metodo,
        status: orderPaymentStatus.pedido_pagamento_status,
        credit_card: {
          brand: clientCards.brand,
          number:
            sql<string>`CONCAT(COALESCE(${clientCards.first_digits}, ''), '********', COALESCE(${clientCards.last_digits}, ''))`.mapWith(
              String
            ),
          credit_card_id:
            sql<string>`BIN_TO_UUID(${clientCards.card_id})`.mapWith(String),
        },
        voucher: orderPayment.voucher,
        boleto: {
          url: orderPayment.pag_info_adicional,
          code: orderPayment.codigo_pagamento,
          expire_at: orderPayment.data_vencimento,
        },
        pix: {
          url: orderPayment.pag_info_adicional,
          code: orderPayment.codigo_pagamento,
          expire_at: orderPayment.data_vencimento,
        },
        cycle: order.recorrencia_periodo,
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
      .innerJoin(order, eq(order.id_pedido, orderPayment.id_pedido))
      .leftJoin(clientCards, eq(clientCards.card_id, orderPayment.card_id))
      .where(and(eq(orderPayment.id_pedido, sql`UUID_TO_BIN(${orderId})`)))
      .execute();

    if (result.length === 0) {
      return [] as OrderPayments[];
    }

    return enrichPaymentOrder(result);
  }

  private async fetchOrderPlan(tokenKeyData: ITokenKeyData, orderId: string) {
    const result = await this.db
      .select({
        plan_id: plan.id_plano,
        status: plan.status,
        visible_site: sql<boolean>`CASE 
          WHEN ${plan.visivel_site} = ${PlanVisivelSite.YES} THEN true
          ELSE false
        END`.mapWith(Boolean),
        business_id: planPartner.id_parceiro,
        plan: plan.plano,
        image: plan.imagem,
        description: plan.descricao,
        short_description: plan.descricao_curta,
      })
      .from(plan)
      .innerJoin(order, eq(order.id_plano, plan.id_plano))
      .innerJoin(planPrice, eq(planPrice.id_plano, plan.id_plano))
      .innerJoin(planPartner, eq(planPartner.id_plano, plan.id_plano))
      .where(
        and(
          eq(order.id_pedido, sql`UUID_TO_BIN(${orderId})`),
          eq(planPartner.id_parceiro, tokenKeyData.id_parceiro)
        )
      )
      .groupBy(plan.id_plano)
      .execute();

    if (result.length === 0) {
      return null;
    }

    const enrichPromises = await this.enrichPlanAndProductGroupsPromises(
      tokenKeyData,
      result[0]
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
      .innerJoin(planPartner, eq(planPartner.id_plano, plan.id_plano))
      .innerJoin(product, eq(planItem.id_produto, product.id_produto))
      .innerJoin(
        productType,
        eq(product.id_produto_tipo, productType.id_produto_tipo)
      )
      .where(
        and(
          eq(plan.id_plano, planId),
          eq(planPartner.id_parceiro, tokenKeyData.id_parceiro)
        )
      )
      .execute();

    if (result.length === 0) {
      return [] as PlanProducts[];
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
        quantity: productGroup.qtd_produtos_selecionaveis,
      })
      .from(plan)
      .innerJoin(planItem, eq(plan.id_plano, planItem.id_plano))
      .innerJoin(planPartner, eq(planPartner.id_plano, plan.id_plano))
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
          eq(planPartner.id_parceiro, tokenKeyData.id_parceiro)
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
        plan: await this.fetchOrderPlan(tokenKeyData, orderPayments.order_id),
      })
    );

    const enrichedPaymentsAndPlans = await Promise.all(
      enrichPaymentsAndPlansPromises
    );

    return enrichedPaymentsAndPlans;
  }

  private async enrichPlanAndProductGroupsPromises(
    tokenKeyData: ITokenKeyData,
    plan: PlanDetails
  ) {
    const [prices, planProducts, productGroups] = await Promise.all([
      this.fetchPricesByPlan(plan.plan_id),
      this.fetchPlanProductDetails(tokenKeyData, plan.plan_id),
      this.fetchPlanProductGroupsDetails(tokenKeyData, plan.plan_id),
    ]);

    return {
      ...plan,
      prices,
      plan_products: planProducts,
      product_groups: productGroups,
    };
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

  async listOrderById(orderId: string): Promise<ListOrderById | null> {
    const result = await this.db
      .select({
        order_id: sql<string>`BIN_TO_UUID(${order.id_pedido})`,
        order_id_previous: sql<string>`BIN_TO_UUID(${order.id_pedido_anterior})`,
        client_id: sql<string>`BIN_TO_UUID(${order.id_cliente})`,
        cart_id: sql<string>`BIN_TO_UUID(${order.id_carrinho})`,
        plan_id: order.id_plano,
        voucher: order.cupom_resgatar_codigo,
        split_rule_id: order.id_financeiro_split_regra,
        company_id: order.id_parceiro,
        seller_id: order.id_vendedor,
        status_id: order.id_pedido_status,
        recurrence: order.recorrencia,
        recurrence_period: order.recorrencia_periodo,
        total_price: order.valor_preco,
        total_discount: order.valor_desconto,
        total_price_with_discount: order.valor_total,
        total_previous_order_discount_value:
          order.valor_desconto_ordem_anterior,
        total_installments: order.pedido_parcelas_vezes,
        total_installments_value: order.pedido_parcelas_valor,
        activation_immediate: order.ativacao_imediata,
        observation: order.obs,
      })
      .from(order)
      .where(and(eq(order.id_pedido, sql`UUID_TO_BIN(${orderId})`)))
      .execute();

    if (result.length === 0) {
      return null;
    }

    return result[0] as unknown as ListOrderById;
  }

  async orderIsExists(orderId: string): Promise<boolean> {
    const result = await this.db
      .select({
        count: count(),
      })
      .from(order)
      .where(and(eq(order.id_pedido, sql`UUID_TO_BIN(${orderId})`)))
      .execute();

    if (!result?.length) {
      return false;
    }

    return result[0].count > 0;
  }
}
