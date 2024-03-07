import * as schema from "@core/models";
import { MySql2Database } from "drizzle-orm/mysql2";
import { inject, injectable } from "tsyringe";
import { smsEmailCodes } from "@core/models";
import { TFAType } from "@core/common/enums/TFAType";
import { generateTokenTfa } from "@core/common/functions/generateTokenTfa";
import { and, eq, gte } from "drizzle-orm";

@injectable()
export class SmsEmailCodesRepository {
  private db: MySql2Database<typeof schema>;

  constructor(
    @inject("Database") mySql2Database: MySql2Database<typeof schema>
  ) {
    this.db = mySql2Database;
  }

  async insertCodeUser(
    type: TFAType,
    login: string,
    code: string
  ): Promise<boolean> {
    const result = await this.db
      .insert(smsEmailCodes)
      .values({
        tipo: type,
        destino: login,
        codigo: code,
      })
      .execute();

    return result.length > 0;
  }

  async generateAndVerifyToken(): Promise<string> {
    let token;
    let isUnique = false;

    do {
      token = generateTokenTfa();

      const validUntil = new Date(new Date().getTime() + 15 * 60000);
      const existingTokens = await this.db
        .select({
          codigo: smsEmailCodes.codigo,
          created_at: smsEmailCodes.created_at,
        })
        .from(smsEmailCodes)
        .where(
          and(
            eq(smsEmailCodes.codigo, token),
            gte(smsEmailCodes.created_at, validUntil)
          )
        )
        .execute();

      isUnique = existingTokens.length === 0;
    } while (!isUnique);

    return token;
  }
}
