import * as schema from "@core/models";
import { MySql2Database } from "drizzle-orm/mysql2";
import { inject, injectable } from "tsyringe";
import { tfaCodes } from "@core/models";
import { and, eq, gte } from "drizzle-orm";
import { adjustCurrentTimeByMinutes } from "@core/common/functions/adjustCurrentTimeByMinutes";

@injectable()
export class TfaCodesWhatsAppRepository {
  constructor(
    @inject("Database") private readonly db: MySql2Database<typeof schema>
  ) {}

  async isTokenUniqueAndValid(token: string): Promise<boolean> {
    const validUntil = adjustCurrentTimeByMinutes();

    const existingTokens = await this.db
      .select({
        codigo: tfaCodes.codigo,
        created_at: tfaCodes.created_at,
      })
      .from(tfaCodes)
      .where(
        and(eq(tfaCodes.codigo, token), gte(tfaCodes.created_at, validUntil))
      )
      .execute();

    return existingTokens.length === 0;
  }
}
