import { inject, injectable } from "tsyringe";
import * as schema from "@core/models";
import { clientEmailNewsletter } from "@core/models/client";
import { MySql2Database } from "drizzle-orm/mysql2";
import { sql } from "drizzle-orm";

@injectable()
export class ClientEmailNewsletterCreatorRepository {
  constructor(
    @inject("Database") private readonly db: MySql2Database<typeof schema>
  ) {}

  async create(clientId: string, clientEmailTypeId: number) {
    const result = await this.db
      .insert(clientEmailNewsletter)
      .values({
        id_cliente_email_tipo: clientEmailTypeId,
        id_cliente: sql`UUID_TO_BIN(${clientId})`,
      })
      .execute();

    if (!result) {
      return false;
    }

    return true;
  }
}
