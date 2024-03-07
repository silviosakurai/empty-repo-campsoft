import * as schema from "@core/models";
import { MySql2Database } from "drizzle-orm/mysql2";
import { inject, injectable } from "tsyringe";
import { tfaCodes, templateWhatsApp, templateModule } from "@core/models";
import { and, desc, eq, gte, or, sql } from "drizzle-orm";
import { TFAType } from "@core/common/enums/models/tfa";
import { ViewApiResponse } from "@core/useCases/api/dtos/ViewApiResponse.dto";
import { TemplateModulo } from "@core/common/enums/TemplateMessage";
import { ITemplateWhatsapp } from "@core/interfaces/repositories/tfa";

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

  async getTemplateWhatsapp(
    apiAccess: ViewApiResponse
  ): Promise<ITemplateWhatsapp> {
    const result = await this.db
      .select({
        template: templateWhatsApp.template,
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
}
