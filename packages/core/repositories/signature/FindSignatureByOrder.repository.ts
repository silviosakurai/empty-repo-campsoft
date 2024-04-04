import { MySql2Database } from "drizzle-orm/mysql2";
import { inject, injectable } from "tsyringe";
import * as schema from "@core/models";
import {
  signatureStatus,
  clientProductSignature,
  clientSignature,
} from "@core/models";
import { and, eq, sql } from "drizzle-orm";
import { ISignatureFindByOrder } from "@core/interfaces/repositories/signature";
import { OrderRecorrencia } from "@core/common/enums/models/order";

@injectable()
export class FindSignatureByOrderNumber {
  constructor(
    @inject("Database") private readonly db: MySql2Database<typeof schema>
  ) {}

  async find(orderNumber: string): Promise<ISignatureFindByOrder[] | null> {
    const records = await this.db
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

    if (!records.length) return null;

    return records as unknown as ISignatureFindByOrder[];
  }
}
