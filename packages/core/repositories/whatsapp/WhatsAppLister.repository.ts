import { inject, injectable } from "tsyringe";
import * as schema from "@core/models";
import { MySql2Database } from "drizzle-orm/mysql2";
import {
  templateModule,
  templateWhatsApp,
  whatsAppHistory,
} from "@core/models";
import { and, eq, sql, or, desc } from "drizzle-orm";
import { ITokenKeyData } from "@core/common/interfaces/ITokenKeyData";
import { TemplateModulo } from "@core/common/enums/TemplateMessage";
import { ITemplateWhatsapp } from "@core/interfaces/repositories/tfa";
import { NotificationTemplate } from "@core/interfaces/services/IClient.service";

@injectable()
export class WhatsAppListerRepository {
  constructor(
    @inject("Database") private readonly db: MySql2Database<typeof schema>
  ) {}

  async getTemplateWhatsapp(
    tokenKeyData: ITokenKeyData,
    templateModulo: TemplateModulo
  ): Promise<ITemplateWhatsapp | null> {
    const result = await this.db
      .select({
        template: templateWhatsApp.template,
        templateId: templateWhatsApp.id_template_whatsapp,
      })
      .from(templateWhatsApp)
      .innerJoin(
        templateModule,
        eq(
          templateModule.id_template_modulo,
          templateWhatsApp.id_template_modulo
        )
      )
      .where(
        or(
          and(
            eq(templateWhatsApp.id_parceiro, tokenKeyData.company_id),
            eq(templateModule.modulo, templateModulo)
          ),
          and(
            eq(
              templateWhatsApp.id_parceiro,
              sql`${templateWhatsApp.id_parceiro} IS NULL`
            ),
            eq(templateModule.modulo, templateModulo)
          )
        )
      )
      .orderBy(desc(templateWhatsApp.id_parceiro))
      .limit(1)
      .execute();

    if (!result.length) {
      return null;
    }

    return result[0] as ITemplateWhatsapp;
  }

  async insertWhatsAppHistory(
    templateId: number,
    notificationTemplate: NotificationTemplate,
    sender: string,
    whatsappToken: string,
    sendDate: string
  ): Promise<boolean> {
    const result = await this.db
      .insert(whatsAppHistory)
      .values({
        id_template: templateId,
        id_cliente: notificationTemplate.clientId ?? null,
        remetente: sender,
        destinatario: notificationTemplate.phoneNumber ?? "",
        whatsapp_token_externo: whatsappToken,
        data_envio: sendDate,
      })
      .execute();

    if (!result) {
      throw new Error("Error inserting whatsapp history");
    }

    return true;
  }
}
