import { MySql2Database } from "drizzle-orm/mysql2";
import { inject, injectable } from "tsyringe";
import * as schema from "@core/models";
import { ITokenKeyData } from "@core/common/interfaces/ITokenKeyData";
import { CreateOrderRequestDto } from "@core/useCases/order/dtos/CreateOrderRequest.dto";
import { ITokenJwtData } from "@core/common/interfaces/ITokenJwtData";
import { order } from "@core/models";
import { and, desc, eq, sql } from "drizzle-orm";
import {
  OrderRecorrencia,
  OrderStatusEnum,
} from "@core/common/enums/models/order";
import { PlanPrice } from "@core/common/enums/models/plan";
import { ViewClientResponse } from "@core/useCases/client/dtos/ViewClientResponse.dto";
import {
  CreateOrder,
  OrderCreatePaymentsCard,
} from "@core/interfaces/repositories/order";

@injectable()
export class OrderCreatorRepository {
  constructor(
    @inject("Database") private readonly db: MySql2Database<typeof schema>
  ) {}

  async create(
    tokenKeyData: ITokenKeyData,
    tokenJwtData: ITokenJwtData,
    payload: CreateOrderRequestDto,
    planPrice: PlanPrice,
    user: ViewClientResponse,
    totalPricesInstallments: OrderCreatePaymentsCard,
    splitRuleId: number
  ): Promise<CreateOrder | null> {
    const valuesObject: typeof schema.order.$inferInsert = {
      id_cliente:
        sql`UUID_TO_BIN(${tokenJwtData.clientId})` as unknown as string,
      id_parceiro: tokenKeyData.id_parceiro,
      id_pedido_status: OrderStatusEnum.PENDING,
      id_plano: payload.plan.plan_id ?? null,
      id_financeiro_split_regra: splitRuleId,
      recorrencia: payload.subscribe
        ? OrderRecorrencia.YES
        : OrderRecorrencia.NO,
      recorrencia_periodo: payload.months ?? 0,
      valor_preco: Number(planPrice.price ?? 0),
      valor_desconto: Number(planPrice.discount_value ?? 0),
      valor_total: Number(planPrice.price_with_discount ?? 0),
      valor_cupom: Number(planPrice.discount_coupon ?? 0),
      desconto_produto: Number(planPrice.discount_product ?? 0),
      valor_desconto_ordem_anterior: Number(
        planPrice.price_with_discount_order_previous ?? 0
      ),
      pedido_parcelas_valor: totalPricesInstallments.value,
      pedido_parcelas_vezes: totalPricesInstallments.installments,
      ativacao_imediata: payload?.activate_now ? payload.activate_now : true,
      cliente_email: user.email,
      cliente_primeiro_nome: user.first_name,
      cliente_ultimo_nome: user.last_name,
      cliente_cpf: user.cpf,
      cliente_telefone: user.phone,
    };

    if (payload.previous_order_id) {
      valuesObject.id_pedido_anterior =
        sql`UUID_TO_BIN(${payload.previous_order_id})` as unknown as string;
    }

    if (payload.coupon_code) {
      valuesObject.cupom_carrinho_codigo = payload.coupon_code;
    }

    if (payload.payment?.voucher) {
      valuesObject.cupom_resgatar_codigo = payload.payment.voucher;
    }

    const result = await this.db.insert(order).values(valuesObject).execute();

    if (!result[0].affectedRows) {
      return null;
    }

    const orderFounded = await this.findLastOrderByIdClient(
      tokenJwtData.clientId,
      tokenKeyData.id_parceiro
    );

    if (!orderFounded) {
      return null;
    }

    return orderFounded;
  }

  async findLastOrderByIdClient(
    clientId: string,
    companyId: number
  ): Promise<CreateOrder | null> {
    const result = await this.db
      .select({
        order_id: sql`BIN_TO_UUID(${order.id_pedido})`,
        order_id_previous: sql`BIN_TO_UUID(${order.id_pedido_anterior})`,
        active_now: order.ativacao_imediata,
      })
      .from(order)
      .where(
        and(
          eq(order.id_cliente, sql`UUID_TO_BIN(${clientId})`),
          eq(order.id_parceiro, companyId)
        )
      )
      .orderBy(desc(order.created_at))
      .execute();

    if (!result.length) {
      return null;
    }

    return result[0] as CreateOrder;
  }
}
