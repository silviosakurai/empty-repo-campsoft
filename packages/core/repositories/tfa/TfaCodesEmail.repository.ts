import * as schema from "@core/models";
import { MySql2Database } from "drizzle-orm/mysql2";
import { inject, injectable } from "tsyringe";
import { templateEmail, templateModule, emailHistory } from "@core/models";
import { and, desc, eq, or, sql } from "drizzle-orm";
import { TemplateModulo } from "@core/common/enums/TemplateMessage";
import { ITemplateEmail } from "@core/interfaces/repositories/tfa";
import { LoginUserTFA } from "@core/interfaces/services/IClient.service";
import { ITokenKeyData } from "@core/common/interfaces/ITokenKeyData";

@injectable()
export class TfaCodesEmail {
  private db: MySql2Database<typeof schema>;

  constructor(
    @inject("Database") mySql2Database: MySql2Database<typeof schema>
  ) {
    this.db = mySql2Database;
  }

  async getTemplateEmail(tokenKeyData: ITokenKeyData): Promise<ITemplateEmail> {
    const result = await this.db
      .select({
        templateId: templateEmail.id_template_email,
        sender: templateEmail.de_email,
        replyTo: templateEmail.responder_para,
        subject: templateEmail.assunto,
        template: templateEmail.email_html,
        templateTxt: templateEmail.email_txt,
      })
      .from(templateEmail)
      .innerJoin(
        templateModule,
        eq(templateModule.id_template_modulo, templateEmail.id_template_modulo)
      )
      .where(
        or(
          and(
            eq(templateEmail.id_empresa, tokenKeyData.company_id),
            eq(templateModule.modulo, TemplateModulo.CODIGO_TFA)
          ),
          and(
            eq(
              templateEmail.id_empresa,
              sql`${templateEmail.id_empresa} IS NULL`
            ),
            eq(templateModule.modulo, TemplateModulo.CODIGO_TFA)
          )
        )
      )
      .orderBy(desc(templateEmail.id_empresa))
      .limit(1)
      .execute();

    if (!result.length) {
      throw new Error("Template not found");
    }

    return result[0] as unknown as ITemplateEmail;
  }

  async insertEmailHistory(
    templateId: number,
    loginUserTFA: LoginUserTFA,
    sender: string | null,
    emailToken: string,
    sendDate: string
  ): Promise<boolean> {
    const result = await this.db
      .insert(emailHistory)
      .values({
        id_template_email: templateId,
        id_cliente: loginUserTFA.clientId ?? null,
        remetente_email: sender ?? "",
        destinatario_email: loginUserTFA.login,
        email_token_externo: emailToken,
        data_envio: sendDate,
      })
      .execute();

    if (!result) {
      throw new Error("Error inserting sms history");
    }

    return true;
  }
}
