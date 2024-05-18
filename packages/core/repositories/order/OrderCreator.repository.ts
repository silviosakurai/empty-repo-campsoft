import { MySql2Database } from "drizzle-orm/mysql2";
import { inject, injectable } from "tsyringe";
import * as schema from "@core/models";
import { ITokenKeyData } from "@core/common/interfaces/ITokenKeyData";
import { CreateOrderRequestDto } from "@core/useCases/order/dtos/CreateOrderRequest.dto";
import { ITokenJwtData } from "@core/common/interfaces/ITokenJwtData";
import { order } from "@core/models";
import { sql } from "drizzle-orm";
import {
  OrderRecorrencia,
  OrderStatusEnum,
} from "@core/common/enums/models/order";
import { ViewClientResponse } from "@core/useCases/client/dtos/ViewClientResponse.dto";
import { OrderCreatePaymentsCard } from "@core/interfaces/repositories/order";
import { CartDocument } from "@core/interfaces/repositories/cart";
import { v4 as uuidv4 } from "uuid";

@injectable()
export class OrderCreatorRepository {
  constructor(
    @inject("Database") private readonly db: MySql2Database<typeof schema>
  ) {}

  async create(
    tokenKeyData: ITokenKeyData,
    tokenJwtData: ITokenJwtData,
    payload: CreateOrderRequestDto,
    cart: CartDocument,
    user: ViewClientResponse,
    totalPricesInstallments: OrderCreatePaymentsCard,
    splitRuleId: number
  ): Promise<string | null> {
    const orderId = uuidv4();

    const valuesObject: typeof schema.order.$inferInsert = {
      id_pedido: sql`UUID_TO_BIN(${orderId})` as unknown as string,
      id_cliente:
        sql`UUID_TO_BIN(${tokenJwtData.clientId})` as unknown as string,
      id_carrinho: sql`UUID_TO_BIN(${payload.cart_id})` as unknown as string,
      id_parceiro: tokenKeyData.id_parceiro,
      id_pedido_status: OrderStatusEnum.PENDING,
      id_plano: cart.payload.plan.plan_id ?? null,
      id_financeiro_split_regra: splitRuleId,
      recorrencia: cart.payload.subscribe
        ? OrderRecorrencia.YES
        : OrderRecorrencia.NO,
      recorrencia_periodo: cart.payload.months ?? 0,
      valor_preco: Number(cart.total_prices.price ?? 0),
      valor_desconto: Number(cart.total_prices.discount_value ?? 0),
      valor_total: Number(cart.total_prices.price_with_discount ?? 0),
      valor_cupom: Number(cart.total_prices.discount_coupon ?? 0),
      desconto_produto: Number(cart.total_prices.discount_product ?? 0),
      valor_desconto_ordem_anterior: Number(
        cart.total_prices.price_with_discount_order_previous ?? 0
      ),
      pedido_parcelas_valor: totalPricesInstallments.value,
      pedido_parcelas_vezes: totalPricesInstallments.installments,
      ativacao_imediata: cart.payload?.activate_now
        ? cart.payload.activate_now
        : true,
      cliente_email: user.email,
      cliente_primeiro_nome: user.first_name,
      cliente_ultimo_nome: user.last_name,
      cliente_cpf: user.cpf,
      cliente_telefone: user.phone,
    };

    if (cart.payload.previous_order_id) {
      valuesObject.id_pedido_anterior =
        sql`UUID_TO_BIN(${cart.payload.previous_order_id})` as unknown as string;
    }

    if (cart.payload.coupon_code) {
      valuesObject.cupom_carrinho_codigo = cart.payload.coupon_code;
    }

    if (payload.payment?.voucher) {
      valuesObject.cupom_resgatar_codigo = payload.payment.voucher;
    }

    const result = await this.db.insert(order).values(valuesObject).execute();

    if (!result[0].affectedRows) {
      return null;
    }

    return orderId;
  }
}
