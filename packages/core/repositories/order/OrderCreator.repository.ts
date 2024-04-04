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
import { OrderCreatePaymentsCard } from "@core/interfaces/repositories/order";

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
    totalPricesInstallments: OrderCreatePaymentsCard
  ): Promise<{ order_id: string } | null> {
    const valuesObject: typeof schema.order.$inferInsert = {
      id_cliente:
        sql`UUID_TO_BIN(${tokenJwtData.clientId})` as unknown as string,
      id_empresa: tokenKeyData.company_id,
      id_pedido_status: OrderStatusEnum.PENDING,
      recorrencia: payload.subscribe
        ? OrderRecorrencia.YES
        : OrderRecorrencia.NO,
      recorrencia_periodo: payload.months ?? 0,
      valor_preco: Number(planPrice.price ?? 0),
      valor_desconto: Number(planPrice.discount_value ?? 0),
      valor_total: Number(planPrice.price_with_discount ?? 0),
      pedido_parcelas_valor: totalPricesInstallments.value,
      pedido_parcelas_vezes: totalPricesInstallments.installments,
      cliente_email: user.email,
      cliente_primeiro_nome: user.first_name,
      cliente_ultimo_nome: user.last_name,
      cliente_cpf: user.cpf,
      cliente_telefone: user.phone,
    };

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
      tokenKeyData.company_id
    );

    if (!orderFounded) {
      return null;
    }

    return { order_id: orderFounded.id_pedido } as { order_id: string };
  }

  async findLastOrderByIdClient(
    clientId: string,
    companyId: number
  ): Promise<{ id_pedido: string } | null> {
    const result = await this.db
      .select({
        id_pedido: sql`BIN_TO_UUID(${order.id_pedido})`,
      })
      .from(order)
      .where(
        and(
          eq(order.id_cliente, sql`UUID_TO_BIN(${clientId})`),
          eq(order.id_empresa, companyId)
        )
      )
      .orderBy(desc(order.created_at))
      .execute();

    if (!result.length) {
      return null;
    }

    return result[0] as { id_pedido: string };
  }
}
