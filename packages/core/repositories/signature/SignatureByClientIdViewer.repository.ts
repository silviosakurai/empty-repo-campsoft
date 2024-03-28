import { MySql2Database } from "drizzle-orm/mysql2";
import { inject, injectable } from "tsyringe";
import * as schema from "@core/models";
import {
  signatureStatus,
  clientProductSignature,
  clientSignature,
} from "@core/models";
import { and, eq, sql } from "drizzle-orm";
import { ISignatureFindByClientId } from "@core/interfaces/repositories/signature";

@injectable()
export class SignatureByClientIdViewer {
  constructor(@inject("Database") private db: MySql2Database<typeof schema>) {}

  async find(client_id: string): Promise<ISignatureFindByClientId[] | null> {
    const records = await this.db
      .select({
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
          eq(clientSignature.id_cliente, sql`UUID_TO_BIN(${client_id})`),
          eq(signatureStatus.assinatura_status, "ativo")
        )
      );

    if (!records.length) return null;

    return records as unknown as ISignatureFindByClientId[];
  }
}
