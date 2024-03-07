import { inject, injectable } from "tsyringe";
import * as schema from "@core/models";
import { MySql2Database } from "drizzle-orm/mysql2";
import { eq } from "drizzle-orm";
import { UpdateClientRequestDto } from "@core/useCases/client/dtos/UpdateClientRequest.dto";

@injectable()
export class ClientUpdaterRepository {
  private db: MySql2Database<typeof schema>;

  constructor(
    @inject("Database") mySql2Database: MySql2Database<typeof schema>
  ) {
    this.db = mySql2Database;
  }

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
      .where(eq(schema.client.id_cliente, clientId))
      .execute();

    if (!result.length) {
      return null;
    }
  }
}
