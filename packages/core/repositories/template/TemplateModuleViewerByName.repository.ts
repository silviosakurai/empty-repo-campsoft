import { MySql2Database } from "drizzle-orm/mysql2";
import { inject, injectable } from "tsyringe";
import * as schema from "@core/models";
import { templateModule } from "@core/models/template";
import { eq } from "drizzle-orm";

@injectable()
export class TemplateModuleViewerByNameRepository {
  constructor(
    @inject("Database") private readonly db: MySql2Database<typeof schema>
  ) {}

  async view(name: string) {
    const result = await this.db
      .select({
        id: templateModule.id_template_modulo,
        module: templateModule.modulo,
      })
      .from(templateModule)
      .where(eq(templateModule.modulo, name))
      .execute();

    if (!result.length) {
      return null;
    }

    return result;
  }
}
