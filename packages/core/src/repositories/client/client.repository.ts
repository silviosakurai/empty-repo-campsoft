import * as schema from "@core/models";
import { client } from "@core/models/client/client.model";
import { MySql2Database } from "drizzle-orm/mysql2";
import { eq } from "drizzle-orm";

export default class ClientRepository {
  private db: MySql2Database<typeof schema>;

  constructor(mySql2Database: MySql2Database<typeof schema>) {
    this.db = mySql2Database;
  }

  findClientByCPF = async (cpf: string) => {
    const result = await this.db
      .select({
        nome: client.nome,
        cpf: client.cpf,
        email: client.email,
        telefone: client.telefone,
      })
      .from(client)
      .where(eq(client.cpf, cpf));

    return result;
  };
}
