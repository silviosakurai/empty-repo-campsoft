import * as schema from "@core/models";
import { MySql2Database } from "drizzle-orm/mysql2";
import { inject, injectable } from "tsyringe";
import { tfaCodes } from "@core/models";
import { and, eq, gte, sql } from "drizzle-orm";
import { IValidateCodeTFA } from "@core/interfaces/repositories/tfa";
import { TFAType, TFAValidated } from "@core/common/enums/models/tfa";
import { adjustCurrentTimeByMinutes } from "@core/common/functions/adjustCurrentTimeByMinutes";

@injectable()
export class TfaCodesRepository {
  private db: MySql2Database<typeof schema>;

  constructor(
    @inject("Database") mySql2Database: MySql2Database<typeof schema>
  ) {
    this.db = mySql2Database;
  }

  async validateCode(
    login: string,
    code: string
  ): Promise<IValidateCodeTFA | null> {
    const validUntil = adjustCurrentTimeByMinutes();

    const codeValid = await this.db
      .select({
        id: tfaCodes.id_code_enviado,
        token: sql`BIN_TO_UUID(${tfaCodes.token})`,
        created_at: tfaCodes.created_at,
      })
      .from(tfaCodes)
      .where(
        and(
          eq(tfaCodes.codigo, code),
          eq(tfaCodes.destino, login),
          eq(tfaCodes.validado, TFAValidated.NO),
          gte(tfaCodes.created_at, validUntil)
        )
      )
      .execute();

    if (codeValid.length === 0) {
      return null;
    }

    const result = codeValid[0] as IValidateCodeTFA;

    await this.updateCodeAsUsed(result.id);

    return result;
  }

  async updateCodeAsUsed(id: number): Promise<boolean> {
    const update = await this.db
      .update(tfaCodes)
      .set({ validado: TFAValidated.YES })
      .where(eq(tfaCodes.id_code_enviado, id))
      .execute();

    return update ? true : false;
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

    if (!result) {
      throw new Error("Error inserting code");
    }

    return true;
  }
}
