import * as schema from "@core/models";
import { MySql2Database } from "drizzle-orm/mysql2";
import { inject, injectable } from "tsyringe";
import { client } from "@core/models";
import { eq, sql, and } from "drizzle-orm";
import { ViewClientResponse } from "@core/useCases/client/dtos/ViewClientResponse.dto";

@injectable()
export class ClientViewerRepository {
  constructor(
    @inject("Database") private readonly db: MySql2Database<typeof schema>
  ) {}

  async view(userId: string): Promise<ViewClientResponse | null> {
    const result = await this.db
      .select({
        client_id: sql`BIN_TO_UUID(${client.id_cliente})`,
        status: client.status,
        first_name: client.nome,
        last_name: client.sobrenome,
        birthday: client.data_nascimento,
        email: client.email,
        phone: client.telefone,
        cpf: client.cpf,
        gender: client.sexo,
        obs: client.obs,
      })
      .from(client)
      .where(and(eq(client.id_cliente, sql`UUID_TO_BIN(${userId})`)))
      .execute();

    if (!result.length) {
      return null;
    }

    return result[0] as unknown as ViewClientResponse;
  }
}
