import { MySql2Database } from "drizzle-orm/mysql2";
import { inject, injectable } from "tsyringe";
import * as schema from "@core/models";
import { clientSignature, plan, signatureStatus } from "@core/models";
import { and, eq, sql } from "drizzle-orm";
import { IFindSignatureActiveByClientId } from "@core/interfaces/repositories/signature";

@injectable()
export class SignatureActiveByClientIdListerRepository {
  constructor(
    @inject("Database") private readonly db: MySql2Database<typeof schema>
  ) {}

  async find(client_id: string): Promise<IFindSignatureActiveByClientId[]> {
    const records = await this.db
      .select({
        signature_id: sql`BIN_TO_UUID(${clientSignature.id_assinatura_cliente})`,
        plan_id: plan.id_plano,
        name: plan.plano,
      })
      .from(clientSignature)
      .innerJoin(plan, eq(plan.id_plano, clientSignature.id_plano))
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

    if (!records.length) {
      return [] as IFindSignatureActiveByClientId[];
    }

    return records as IFindSignatureActiveByClientId[];
  }
}
