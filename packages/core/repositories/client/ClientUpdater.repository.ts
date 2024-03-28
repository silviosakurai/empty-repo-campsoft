import { inject, injectable } from "tsyringe";
import * as schema from "@core/models";
import { MySql2Database } from "drizzle-orm/mysql2";
import { eq, sql } from "drizzle-orm";
import { UpdateClientRequestDto } from "@core/useCases/client/dtos/UpdateClientRequest.dto";

@injectable()
export class ClientUpdaterRepository {
  constructor(
    @inject("Database") private readonly db: MySql2Database<typeof schema>
  ) {}

  async update(clientId: string, input: UpdateClientRequestDto) {
    const result = await this.db
      .update(schema.client)
      .set({
        data_nascimento: input.birthday,
        nome: input.first_name,
        sobrenome: input.last_name,
        sexo: input.gender,
        obs: input.obs,
        status: input.status,
      })
      .where(eq(schema.client.id_cliente, sql`UUID_TO_BIN(${clientId})`))
      .execute();

    if (!result[0].affectedRows) {
      return null;
    }

    return true;
  }
}
