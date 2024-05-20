import { MySql2Database } from "drizzle-orm/mysql2";
import { inject, injectable } from "tsyringe";
import * as schema from "@core/models";
import { ITokenKeyData } from "@core/common/interfaces/ITokenKeyData";
import { VoucherOrderRequestDto } from "@core/useCases/order/dtos/CreateOrderRequest.dto";
import { ITokenJwtData } from "@core/common/interfaces/ITokenJwtData";
import { order } from "@core/models";
import { sql } from "drizzle-orm";
import {
  OrderRecorrencia,
  OrderStatusEnum,
} from "@core/common/enums/models/order";
import { ViewClientResponse } from "@core/useCases/client/dtos/ViewClientResponse.dto";
import { v4 as uuidv4 } from "uuid";

@injectable()
export class OrderCreatorByVoucherRepository {
  constructor(
    @inject("Database") private readonly db: MySql2Database<typeof schema>
  ) {}

  async create(
    tokenKeyData: ITokenKeyData,
    tokenJwtData: ITokenJwtData,
    payload: VoucherOrderRequestDto,
    user: ViewClientResponse,
    planId: number
  ): Promise<string | null> {
    const orderId = uuidv4();

    const result = await this.db
      .insert(order)
      .values({
        id_pedido: sql`UUID_TO_BIN(${orderId})` as unknown as string,
        id_cliente:
          sql`UUID_TO_BIN(${tokenJwtData.clientId})` as unknown as string,
        id_parceiro: tokenKeyData.id_parceiro,
        id_pedido_status: OrderStatusEnum.PENDING,
        id_plano: planId,
        recorrencia: OrderRecorrencia.NO,
        cupom_resgatar_codigo: payload.voucher,
        ativacao_imediata: true,
        cliente_email: user.email,
        cliente_primeiro_nome: user.first_name,
        cliente_ultimo_nome: user.last_name,
        cliente_cpf: user.cpf,
        cliente_telefone: user.phone,
      })
      .execute();

    if (!result[0].affectedRows) {
      return null;
    }

    return orderId;
  }
}
