import { inject, injectable } from "tsyringe";
import * as schema from "@core/models";
import { MySql2Database } from "drizzle-orm/mysql2";
import { financeSplitRules, financeSplitList } from "@core/models";
import { eq, and } from "drizzle-orm";
import { FinanceAccountsSplitRulesStatus } from "@core/common/enums/models/financeAccountsSplitRules";

@injectable()
export class PaymentSplitRulesViewerRepository {
  constructor(
    @inject("Database") private readonly db: MySql2Database<typeof schema>
  ) {}

  async view(ruleId: number) {
    const results = await this.db
      .select({
        name: financeSplitRules.regra_nome,
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
          eq(financeSplitRules.status, FinanceAccountsSplitRulesStatus.active)
        )
      );

    if (!results.length) return null;

    return results;
  }
}
// todo: remover tabelas com zoop && renomear a tabela fi_zoop_split_lista e remover a fi_contas
