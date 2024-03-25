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
import { and, eq, sql } from "drizzle-orm";
import { ListOrder } from "@core/interfaces/repositories/order";
import { OrderPaymentsMethodsEnum } from "@core/common/enums/models/order";
import { PlanVisivelSite } from "@core/common/enums/models/plan";

@injectable()
export class ListOrdersRepository {
  private db: MySql2Database<typeof schema>;

  constructor(
    @inject("Database") mySql2Database: MySql2Database<typeof schema>
  ) {
    this.db = mySql2Database;
  }

  async list(tokenKeyData: ITokenKeyData, tokenJwtData: ITokenJwtData) {
    const result = await this.db
      .select({
        order_id: sql<string>`BIN_TO_UUID(${order.id_pedido})`,
        client_id: sql<string>`BIN_TO_UUID(${order.id_cliente})`,
        seller_id: sql<string>`BIN_TO_UUID(${order.id_vendedor})`,
        status: orderStatus.pedido_status,
      })
      .from(order)
      .innerJoin(
        orderStatus,
        eq(orderStatus.id_pedido_status, order.id_pedido_status)
      )
      .where(
        and(
          eq(order.id_empresa, tokenKeyData.company_id),
          eq(order.id_cliente, sql`UUID_TO_BIN(${tokenJwtData.clientId})`)
        )
      )
      .execute();

    if (result.length === 0) {
      return null;
    }

    const enrichPromises = await this.enrichPaymentsAndPlansPromises(result);

    return enrichPromises;
  }

  private async enrichPaymentsAndPlansPromises(result: ListOrder[]) {
    const enrichPaymentsAndPlansPromises = result.map(
      async (orderPayments: ListOrder) => ({
        ...orderPayments,
        payments: await this.fetchOrderPayments(orderPayments.order_id),
        plans: await this.fetchOrderPlans(orderPayments.order_id),
        plan_products: await this.fetchOrderPlansProducts(
          orderPayments.order_id
        ),
        product_groups: await this.fetchOrderPlansProductsGroups(
          orderPayments.order_id
        ),
      })
    );

    const enrichedPaymentsAndPlans = await Promise.all(
      enrichPaymentsAndPlansPromises
    );

    return enrichedPaymentsAndPlans;
  }

  private async fetchOrderPayments(orderId: string) {
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
      return null;
    }

    return result;
  }

  private async fetchOrderPlans(orderId: string) {
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
        prices: {
          price: planPrice.preco,
          discount_value: planPrice.desconto_valor,
          discount_percentage: planPrice.desconto_porcentagem,
          price_with_discount: planPrice.preco_desconto,
        },
      })
      .from(plan)
      .innerJoin(orderItem, eq(orderItem.id_plano, plan.id_plano))
      .innerJoin(order, eq(order.id_pedido, orderItem.id_pedido))
      .innerJoin(planPrice, eq(planPrice.id_plano, plan.id_plano))
      .where(and(eq(order.id_pedido, sql`UUID_TO_BIN(${orderId})`)))
      .groupBy(plan.id_plano)
      .execute();

    if (result.length === 0) {
      return null;
    }

    return result;
  }

  private async fetchOrderPlansProducts(orderId: string) {
    const result = await this.db
      .select({
        product_id: product.id_produto,
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
      .from(product)
      .innerJoin(orderItem, eq(orderItem.id_produto, product.id_produto))
      .innerJoin(order, eq(orderItem.id_pedido, order.id_pedido))
      .innerJoin(
        productType,
        eq(product.id_produto_tipo, productType.id_produto_tipo)
      )
      .where(and(eq(order.id_pedido, sql`UUID_TO_BIN(${orderId})`)))
      .execute();

    if (result.length === 0) {
      return null;
    }

    return result;
  }

  private async fetchOrderPlansProductsGroups(orderId: string) {
    const result = await this.db
      .select({
        product_group_id: productGroup.id_produto_grupo,
        name: productGroup.produto_grupo,
        quantity: sql<number>`COUNT(${productGroupProduct.id_produto_grupo})`,
      })
      .from(productGroup)
      .innerJoin(
        planItem,
        eq(planItem.id_produto_grupo, productGroup.id_produto_grupo)
      )
      .innerJoin(plan, eq(plan.id_plano, planItem.id_plano))
      .innerJoin(orderItem, eq(orderItem.id_plano, plan.id_plano))
      .innerJoin(order, eq(order.id_pedido, orderItem.id_pedido))
      .leftJoin(
        productGroupProduct,
        eq(productGroup.id_produto_grupo, productGroupProduct.id_produto_grupo)
      )
      .where(and(eq(order.id_pedido, sql`UUID_TO_BIN(${orderId})`)))
      .groupBy(productGroupProduct.id_produto_grupo)
      .execute();

    if (result.length === 0) {
      return null;
    }

    return result;
  }
}
