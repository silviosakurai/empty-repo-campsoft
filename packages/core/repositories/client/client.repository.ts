import * as schema from "@core/models";
import { client } from "@core/models";
import { MySql2Database } from "drizzle-orm/mysql2";
import { eq } from "drizzle-orm";
import type { IClientByCPF } from "@core/interfaces/repositories/client/IClientByCPF.interface";
import { inject, injectable } from "tsyringe";

@injectable()
export class ClientRepository {
  private db: MySql2Database<typeof schema>;

  constructor(
    @inject("Database") mySql2Database: MySql2Database<typeof schema>
  ) {
    this.db = mySql2Database;
  }

  findClientByCPF = async (cpf: string): Promise<IClientByCPF | null> => {
    const result = await this.db
      .select({
        nome: client.nome,
        cpf: client.cpf,
        email: client.email,
        telefone: client.telefone,
      })
      .from(client)
      .where(eq(client.cpf, cpf))
      .execute();

    return result.length > 0 ? result[0] : null;
  };
}
