import * as schema from "@core/models";
import { MySql2Database } from "drizzle-orm/mysql2";
import { inject, injectable } from "tsyringe";
import {
  tfaCodes,
  templateWhatsApp,
  templateModule,
  whatsAppHistory,
} from "@core/models";
import { and, desc, eq, gte, or, sql } from "drizzle-orm";
import { TFAType } from "@core/common/enums/models/tfa";
import { ViewApiResponse } from "@core/useCases/api/dtos/ViewApiResponse.dto";
import { TemplateModulo } from "@core/common/enums/TemplateMessage";
import { ITemplateWhatsapp } from "@core/interfaces/repositories/tfa";
import { adjustCurrentTimeByMinutes } from "@core/common/functions/adjustCurrentTimeByMinutes";

@injectable()
export class TfaCodesWhatsAppRepository {
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

    if (!result) {
      throw new Error("Error inserting code");
    }

    return true;
  }

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

  async getTemplateWhatsapp(
    apiAccess: ViewApiResponse
  ): Promise<ITemplateWhatsapp> {
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
            eq(templateWhatsApp.id_empresa, apiAccess.company_id),
            eq(templateModule.modulo, TemplateModulo.CODIGO_TFA)
          ),
          and(
            eq(
              templateWhatsApp.id_empresa,
              sql`${templateWhatsApp.id_empresa} IS NULL`
            ),
            eq(templateModule.modulo, TemplateModulo.CODIGO_TFA)
          )
        )
      )
      .orderBy(desc(templateWhatsApp.id_empresa))
      .limit(1)
      .execute();

    if (!result.length) {
      throw new Error("Template not found");
    }

    return result[0] as unknown as ITemplateWhatsapp;
  }

  async insertWhatsAppHistory(
    templateId: number,
    sender: string,
    recipient: string,
    whatsappToken: string,
    sendDate: string,
    clientId: string | null = null
  ): Promise<boolean> {
    const result = await this.db
      .insert(whatsAppHistory)
      .values({
        id_template: templateId,
        id_cliente: clientId,
        remetente: sender,
        destinatario: recipient,
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