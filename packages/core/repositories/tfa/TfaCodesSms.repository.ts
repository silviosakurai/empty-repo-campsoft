import * as schema from "@core/models";
import { MySql2Database } from "drizzle-orm/mysql2";
import { inject, injectable } from "tsyringe";
import { templateSms, templateModule, smsHistory } from "@core/models";
import { and, desc, eq, or, sql } from "drizzle-orm";
import { TemplateModulo } from "@core/common/enums/TemplateMessage";
import { ITemplateSMS } from "@core/interfaces/repositories/tfa";
import { LoginUserTFA } from "@core/interfaces/services/IClient.service";
import { ITokenKeyData } from "@core/common/interfaces/ITokenKeyData";

@injectable()
export class TfaCodesSms {
  private db: MySql2Database<typeof schema>;

  constructor(
    @inject("Database") mySql2Database: MySql2Database<typeof schema>
  ) {
    this.db = mySql2Database;
  }

  async getTemplateSms(tokenKeyData: ITokenKeyData): Promise<ITemplateSMS> {
    const result = await this.db
      .select({
        template: templateSms.template,
        templateId: templateSms.id_template_sms,
      })
      .from(templateSms)
      .innerJoin(
        templateModule,
        eq(templateModule.id_template_modulo, templateSms.id_template_modulo)
      )
      .where(
        or(
          and(
            eq(templateSms.id_empresa, tokenKeyData.company_id),
            eq(templateModule.modulo, TemplateModulo.CODIGO_TFA)
          ),
          and(
            eq(templateSms.id_empresa, sql`${templateSms.id_empresa} IS NULL`),
            eq(templateModule.modulo, TemplateModulo.CODIGO_TFA)
          )
        )
      )
      .orderBy(desc(templateSms.id_empresa))
      .limit(1)
      .execute();

    if (!result.length) {
      throw new Error("Template not found");
    }

    return result[0] as unknown as ITemplateSMS;
  }

  async insertSmsHistory(
    templateId: number,
    loginUserTFA: LoginUserTFA,
    smsToken: string,
    sendDate: string
  ): Promise<boolean> {
    const result = await this.db
      .insert(smsHistory)
      .values({
        id_template: templateId,
        id_cliente: loginUserTFA.clientId ?? null,
        destinatario: loginUserTFA.login,
        sms_token_externo: smsToken,
        data_envio: sendDate,
      })
      .execute();

    if (!result) {
      throw new Error("Error inserting sms history");
    }

    return true;
  }
}
