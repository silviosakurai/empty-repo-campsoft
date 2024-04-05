import { inject, injectable } from "tsyringe";
import * as schema from "@core/models";
import { clientEmail } from "@core/models/client";
import { MySql2Database } from "drizzle-orm/mysql2";
import { sql } from "drizzle-orm";
import { ClientEmailCreatorInput } from "@core/interfaces/repositories/client";

@injectable()
export class ClientEmailCreatorRepository {
  constructor(
    @inject("Database") private readonly db: MySql2Database<typeof schema>
  ) {}

  async create(input: ClientEmailCreatorInput) {
    const result = await this.db
      .insert(clientEmail)
      .values({
        id_cliente: sql`UUID_TO_BIN(${input.clientId})`,
        email: input.email,
        id_cliente_email_tipo: input.emailType,
      })
      .execute();

    if (!result) {
      return false;
    }

    return true;
  }
}
