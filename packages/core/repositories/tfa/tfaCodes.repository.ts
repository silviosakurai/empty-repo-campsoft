import * as schema from "@core/models";
import { MySql2Database } from "drizzle-orm/mysql2";
import { inject, injectable } from "tsyringe";
import { tfaCodes } from "@core/models";
import { and, eq, gte } from "drizzle-orm";
import { TFAType } from "@core/common/enums/models/tfa";

@injectable()
export class TfaCodesRepository {
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
      .insert(tfaCodes)
      .values({
        tipo: type,
        destino: login,
        codigo: code,
      })
      .execute();

    return result.length > 0;
  }

  async isTokenUniqueAndValid(token: string): Promise<boolean> {
    const validUntil = new Date(new Date().getTime() + 15 * 60000);

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

  /* async getTemplateWhatsapp(): Promise<string> {
    const result = await this.db
      .select({
        templante: smsEmailCodes.templante,
      })
      .from(smsTemplates)
      .where(eq(smsEmailCodes.tipo, TFAType.WHATSAPP))
      .execute();

    return result[0].template;
  } */
}

//
