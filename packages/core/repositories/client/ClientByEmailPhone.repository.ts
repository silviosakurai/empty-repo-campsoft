import { inject, injectable } from "tsyringe";
import * as schema from "@core/models";
import { MySql2Database } from "drizzle-orm/mysql2";
import { eq, or, sql } from "drizzle-orm";
import { client } from "@core/models";
import { FindClientByEmailPhoneInput } from "@core/interfaces/repositories/client";

@injectable()
export class ClientByEmailPhoneRepository {
  constructor(
    @inject("Database") private readonly db: MySql2Database<typeof schema>
  ) {}

  async find(
    input: FindClientByEmailPhoneInput
  ): Promise<{ id_cliente: string } | null> {
    const result = await this.db
      .select({
        id_cliente: sql`BIN_TO_UUID(${client.id_cliente})`,
      })
      .from(client)
      .where(
        or(eq(client.email, input.email), eq(client.telefone, input.phone))
      )
      .execute();

    if (!result.length) {
      return null;
    }

    return result[0] as unknown as { id_cliente: string };
  }
}
