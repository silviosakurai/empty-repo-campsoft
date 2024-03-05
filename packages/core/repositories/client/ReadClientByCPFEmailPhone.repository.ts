import { inject, injectable } from "tsyringe";
import * as schema from "@core/models";
import { MySql2Database } from "drizzle-orm/mysql2";
import { eq, or, and, sql } from "drizzle-orm";
import { client } from "@core/models";

@injectable()
export class ReadClientByCpfEmailPhoneRepository {
  private db: MySql2Database<typeof schema>;

  constructor(
    @inject("Database") mySql2Database: MySql2Database<typeof schema>
  ) {
    this.db = mySql2Database;
  }

  async find(input: FindClientByCpfEmailPhoneInput) {
    const result = await this.db
      .select({
        id_cliente: sql`BIN_TO_UUID(${client.id_cliente}) AS id_cliente`,
      })
      .from(client)
      .where(or(eq(client.cpf, input.cpf)))
      .execute();

    return result;
  }
}

export interface FindClientByCpfEmailPhoneInput {
  cpf: string;
  email: string;
  phone: string;
}
