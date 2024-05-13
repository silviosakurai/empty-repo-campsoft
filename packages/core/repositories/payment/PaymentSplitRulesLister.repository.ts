import { inject, injectable } from "tsyringe";
import * as schema from "@core/models";
import { MySql2Database } from "drizzle-orm/mysql2";
import { financeSplitRules, financeSplitList } from "@core/models";
import { eq, and, sql } from "drizzle-orm";
import { FinanceSplitRulesStatus } from "@core/common/enums/models/financeSplitRules";
import {
  FinanceSplitListIsLiable,
  FinanceSplitListStatus,
} from "@core/common/enums/models/financeSplitList";
import { PaymentSplitRulesListerResponse } from "@core/interfaces/repositories/payment";

@injectable()
export class PaymentSplitRulesListerRepository {
  constructor(
    @inject("Database") private readonly db: MySql2Database<typeof schema>
  ) {}

  async list(
    ruleId: number
  ): Promise<PaymentSplitRulesListerResponse[] | null> {
    const results = await this.db
      .select({
        name: financeSplitRules.regra_nome,
        recipient: financeSplitList.id_financeiro_vendedor,
        liable: sql`CASE
          WHEN ${financeSplitList.liable} = ${FinanceSplitListIsLiable.YES} THEN true
          ELSE false
        END`.mapWith(Boolean),
        charge_processing_fee: sql`CASE
          WHEN ${financeSplitList.charge_processing_fee} = ${FinanceSplitListIsLiable.YES} THEN true
          ELSE false
        END`.mapWith(Boolean),
        amount: financeSplitList.valor,
        charge_recipient_processing_fee: sql`CASE
          WHEN ${financeSplitList.charge_recipient_processing_fee} = ${FinanceSplitListIsLiable.YES} THEN true
          ELSE false
        END`.mapWith(Boolean),
        is_gross_amount: sql`CASE
          WHEN ${financeSplitList.is_gross_amount} = ${FinanceSplitListIsLiable.YES} THEN true
          ELSE false
        END`.mapWith(Boolean),
        isMain: financeSplitList.principal,
        percentage_or_amount: financeSplitList.percentage_or_amount,
      })
      .from(financeSplitRules)
      .innerJoin(
        financeSplitList,
        eq(
          financeSplitRules.id_financeiro_split_regras,
          financeSplitList.id_financeiro_split_regras
        )
      )
      .where(
        and(
          eq(financeSplitRules.id_financeiro_split_regras, ruleId),
          eq(financeSplitRules.status, FinanceSplitRulesStatus.active),
          eq(financeSplitList.status, FinanceSplitListStatus.ACTIVE)
        )
      );

    if (!results.length) return null;

    return results;
  }
}
// todo: remover tabelas com zoop && remover a fi_contas
