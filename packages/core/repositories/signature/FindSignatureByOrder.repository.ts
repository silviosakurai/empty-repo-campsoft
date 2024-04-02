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

@injectable()
export class FindSignatureByOrderNumber {
  private db: MySql2Database<typeof schema>;

  constructor(
    @inject("Database") mySql2Database: MySql2Database<typeof schema>
  ) {
    this.db = mySql2Database;
  }

  async find(orderNumber: string): Promise<ISignatureFindByOrder[] | null> {
    const records = await this.db
      .select({
        signature_id: sql`BIN_TO_UUID(${clientSignature.id_assinatura_cliente})`,
        product_id: clientProductSignature.id_produto,
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
