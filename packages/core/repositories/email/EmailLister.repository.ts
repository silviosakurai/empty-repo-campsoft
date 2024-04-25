import { inject, injectable } from "tsyringe";
import * as schema from "@core/models";
import { MySql2Database } from "drizzle-orm/mysql2";
import {
  emailDomains,
  templateEmail,
  templateModule,
  emailHistory,
} from "@core/models";
import { and, count, eq, like, sql, or, desc, inArray } from "drizzle-orm";
import { EmailBlock, EmailType } from "@core/common/enums/models/email";
import { ITokenKeyData } from "@core/common/interfaces/ITokenKeyData";
import { ITemplateEmail } from "@core/interfaces/repositories/tfa";
import { TemplateModulo } from "@core/common/enums/TemplateMessage";
import { NotificationTemplate } from "@core/interfaces/services/IClient.service";

@injectable()
export class EmailListerRepository {
  constructor(
    @inject("Database") private readonly db: MySql2Database<typeof schema>
  ) {}

  async isEmailDisposable(emailDomain: string): Promise<boolean> {
    const results = await this.db
      .select({
        total: count(),
      })
      .from(emailDomains)
      .where(
        and(
          like(emailDomains.email, emailDomain),
          eq(emailDomains.tipo, EmailType.DISPOSABLE),
          eq(emailDomains.bloquear, EmailBlock.YES)
        )
      );

    return results[0].total > 0;
  }

  async getTemplateEmail(
    tokenKeyData: ITokenKeyData,
    templateModulo: TemplateModulo
  ): Promise<ITemplateEmail | null> {
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
            eq(templateEmail.id_parceiro, tokenKeyData.id_parceiro),
            eq(templateModule.modulo, templateModulo)
          ),
          and(
            eq(
              templateEmail.id_parceiro,
              sql`${templateEmail.id_parceiro} IS NULL`
            ),
            eq(templateModule.modulo, templateModulo)
          )
        )
      )
      .orderBy(desc(templateEmail.id_parceiro))
      .limit(1)
      .execute();

    if (!result.length) {
      return null;
    }

    return result[0] as ITemplateEmail;
  }

  async getTemplateEmailToPartner(
    partnerIds: number[],
    templateModulo: TemplateModulo
  ): Promise<ITemplateEmail | null> {
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
            inArray(templateEmail.id_parceiro, partnerIds),
            eq(templateModule.modulo, templateModulo)
          ),
          and(
            eq(
              templateEmail.id_parceiro,
              sql`${templateEmail.id_parceiro} IS NULL`
            ),
            eq(templateModule.modulo, templateModulo)
          )
        )
      )
      .orderBy(desc(templateEmail.id_parceiro))
      .limit(1)
      .execute();

    if (!result.length) {
      return null;
    }

    return result[0] as ITemplateEmail;
  }

  async insertEmailHistory(
    templateId: number,
    notificationTemplate: NotificationTemplate,
    sender: string | null,
    emailToken: string,
    sendDate: string
  ): Promise<boolean> {
    const result = await this.db
      .insert(emailHistory)
      .values({
        id_template_email: templateId,
        id_cliente: notificationTemplate.clientId ?? null,
        remetente_email: sender ?? "",
        destinatario_email: notificationTemplate.email ?? "",
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
