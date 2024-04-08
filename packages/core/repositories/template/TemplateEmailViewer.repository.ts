import { MySql2Database } from "drizzle-orm/mysql2";
import { inject, injectable } from "tsyringe";
import * as schema from "@core/models";
import { templateEmail, templateModule } from "@core/models/template";
import { and, eq } from "drizzle-orm";

@injectable()
export class TemplateEmailViewer {
  constructor(
    @inject("Database") private readonly db: MySql2Database<typeof schema>
  ) {}

  async view(templateModuleId: number, companyId?: number) {
    const query = this.db
      .select({
        id: templateEmail.id_template_email,
        name: templateEmail.template_nome,
        fromName: templateEmail.de_nome,
        fromEmail: templateEmail.de_email,
        subject: templateEmail.assunto,
        text: templateEmail.email_txt,
        html: templateEmail.email_html,
      })
      .from(templateEmail)
      .innerJoin(
        templateModule,
        eq(templateModule.id_template_modulo, templateEmail.id_template_modulo)
      )
      .where(
        and(
          eq(templateModule.id_template_modulo, templateModuleId)
          // (companyId ? eq(templateEmail.id_empresa, companyId) : '')
        )
      );

    const result = await query.execute();

    return result;
  }
}
