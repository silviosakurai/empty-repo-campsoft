import { inject, injectable } from "tsyringe";
import * as schema from "@core/models";
import { MySql2Database } from "drizzle-orm/mysql2";
import { sql, eq } from "drizzle-orm";
import { clientEmailNewsletter } from "@core/models/client";

@injectable()
export class ClientNewsletterViewerRepository {
  constructor(
    @inject("Database") private readonly db: MySql2Database<typeof schema>
  ) {}

  async view(clientId: string) {
    const results = await this.db
      .select({})
      .from(clientEmailNewsletter)
      .where(
        eq(clientEmailNewsletter.id_cliente, sql`UUID_TO_BIN(${clientId})`)
      );
  }
}
