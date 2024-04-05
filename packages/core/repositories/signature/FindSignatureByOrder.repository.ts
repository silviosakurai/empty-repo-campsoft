import { MySql2Database } from "drizzle-orm/mysql2";
import { inject, injectable } from "tsyringe";
import * as schema from "@core/models";
import {
  signatureStatus,
  clientProductSignature,
  clientSignature,
} from "@core/models";
import { and, eq, sql } from "drizzle-orm";
import {
  ISignatureByOrder,
  ISignatureFindByOrder,
} from "@core/interfaces/repositories/signature";
import { OrderRecorrencia } from "@core/common/enums/models/order";

@injectable()
export class FindSignatureByOrderNumber {
  constructor(
    @inject("Database") private readonly db: MySql2Database<typeof schema>
  ) {}

  async find(orderNumber: string): Promise<ISignatureFindByOrder[] | null> {
    const response = await this.db
      .select({
        signature_id: sql`BIN_TO_UUID(${clientSignature.id_assinatura_cliente})`,
        product_id: clientProductSignature.id_produto,
        product_cancel_date: sql`CASE 
          WHEN ${clientSignature.recorrencia} = ${OrderRecorrencia.YES} 
            THEN DATE_SUB(${clientSignature.data_proxima_cobranca}, INTERVAL 1 DAY)
          ELSE DATE_SUB(${clientSignature.data_assinatura_ate}, INTERVAL 1 DAY)
        END`,
      })
      .from(clientSignature)
      .innerJoin(
        clientProductSignature,
        eq(
          clientSignature.id_assinatura_cliente,
          clientProductSignature.id_assinatura_cliente
        )
      )
      .innerJoin(
        signatureStatus,
        eq(
          clientSignature.id_assinatura_status,
          signatureStatus.id_assinatura_status
        )
      )
      .where(
        and(
          eq(clientSignature.id_pedido, sql`UUID_TO_BIN(${orderNumber})`),
          eq(signatureStatus.assinatura_status, "ativo")
        )
      );

    if (response.length === 0) {
      return null;
    }

    return response as ISignatureFindByOrder[];
  }

  async findByOrder(orderNumber: string): Promise<ISignatureByOrder | null> {
    const response = await this.db
      .select({
        signature_id: sql`BIN_TO_UUID(${clientSignature.id_assinatura_cliente})`,
        plan_id: clientSignature.id_plano,
        recurrence: clientSignature.recorrencia,
        recurrence_period: clientSignature.recorrencia_periodo,
        cycle: clientSignature.ciclo,
        start_date: clientSignature.data_inicio,
        signature_date: clientSignature.data_assinatura_ate,
        next_billing_date: clientSignature.data_proxima_cobranca,
      })
      .from(clientSignature)
      .where(
        and(eq(clientSignature.id_pedido, sql`UUID_TO_BIN(${orderNumber})`))
      );

    if (response.length === 0) {
      return null;
    }

    return response[0] as unknown as ISignatureByOrder;
  }
}
