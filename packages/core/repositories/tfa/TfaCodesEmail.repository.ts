import * as schema from "@core/models";
import { MySql2Database } from "drizzle-orm/mysql2";
import { inject, injectable } from "tsyringe";
import { templateEmail, templateModule, emailHistory } from "@core/models";
import { and, desc, eq, or, sql } from "drizzle-orm";
import { ViewApiResponse } from "@core/useCases/api/dtos/ViewApiResponse.dto";
import { TemplateModulo } from "@core/common/enums/TemplateMessage";
import {
  ITemplateEmail,
  ITemplateSMS,
} from "@core/interfaces/repositories/tfa";

@injectable()
export class TfaCodesEmail {
  private db: MySql2Database<typeof schema>;

  constructor(
    @inject("Database") mySql2Database: MySql2Database<typeof schema>
  ) {
    this.db = mySql2Database;
  }

  async getTemplateEmail(apiAccess: ViewApiResponse): Promise<ITemplateEmail> {
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
            eq(templateEmail.id_empresa, apiAccess.company_id),
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
    recipient: string,
    sender: string | null,
    emailToken: string,
    sendDate: string,
    clientId: string | null = null
  ): Promise<boolean> {
    const result = await this.db
      .insert(emailHistory)
      .values({
        id_template_email: templateId,
        id_cliente: clientId,
        remetente_email: sender ?? "",
        destinatario_email: recipient,
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
