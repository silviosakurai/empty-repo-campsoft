import * as schema from "@core/models";
import { MySql2Database } from "drizzle-orm/mysql2";
import { inject, injectable } from "tsyringe";
import { tfaCodes } from "@core/models";
import { and, eq, gte, sql } from "drizzle-orm";
import { IValidateCodeTFA } from "@core/interfaces/repositories/tfa";
import { TFAType, TFAValidated } from "@core/common/enums/models/tfa";
import { adjustCurrentTimeByMinutes } from "@core/common/functions/adjustCurrentTimeByMinutes";
import { LoginUserTFA } from "@core/interfaces/services/IClient.service";

@injectable()
export class TfaCodesRepository {
  constructor(
    @inject("Database") private readonly db: MySql2Database<typeof schema>
  ) {}

  async validateCode(
    login: string,
    code: string,
    isUuidValid: boolean
  ): Promise<IValidateCodeTFA | null> {
    const codeValid = isUuidValid
      ? await this.validateCodeByClientId(login, code)
      : await this.validateCodeByCode(login, code);

    if (codeValid.length === 0) {
      return null;
    }

    const result = codeValid[0] as IValidateCodeTFA;

    await this.updateCodeAsUsed(result.id);

    return result;
  }

  async validateCodeByCode(login: string, code: string) {
    const validUntil = adjustCurrentTimeByMinutes();

    return await this.db
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
  }

  async validateCodeByClientId(clientId: string, code: string) {
    const validUntil = adjustCurrentTimeByMinutes();

    return await this.db
      .select({
        id: tfaCodes.id_code_enviado,
        token: sql`BIN_TO_UUID(${tfaCodes.token})`,
        created_at: tfaCodes.created_at,
      })
      .from(tfaCodes)
      .where(
        and(
          eq(tfaCodes.codigo, code),
          eq(tfaCodes.id_cliente, sql`UUID_TO_BIN(${clientId})`),
          eq(tfaCodes.validado, TFAValidated.NO),
          gte(tfaCodes.created_at, validUntil)
        )
      )
      .execute();
  }

  async updateCodeAsUsed(id: number): Promise<boolean> {
    const update = await this.db
      .update(tfaCodes)
      .set({ validado: TFAValidated.YES })
      .where(eq(tfaCodes.id_code_enviado, id))
      .execute();

    return !!update;
  }

  async insertCodeUser(
    type: TFAType,
    loginUserTFA: LoginUserTFA,
    code: string
  ): Promise<boolean> {
    const result = await this.db
      .insert(tfaCodes)
      .values({
        tipo: type,
        id_cliente: sql`UUID_TO_BIN(${loginUserTFA.clientId})`,
        destino: loginUserTFA.login,
        codigo: code,
      })
      .execute();

    if (!result) {
      throw new Error("Error inserting code");
    }

    return true;
  }
}
