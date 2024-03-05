import { inject, injectable } from "tsyringe";
import * as schema from "@core/models";
import { MySql2Database } from "drizzle-orm/mysql2";
import { client } from "@core/models";
import { CreateClientRequestDto } from "@core/useCases/client/dtos/CreateClientRequest.dto";

@injectable()
export class ReadClientByCpfEmailPhoneRepository {
  private db: MySql2Database<typeof schema>;

  constructor(
    @inject("Database") mySql2Database: MySql2Database<typeof schema>
  ) {
    this.db = mySql2Database;
  }

  async find(
    input: CreateClientRequestDto
  ): Promise<{ id_cliente: string }[] | null> {
    const result = await this.db.insert(client).values({
      telefone: input.phone,
      cpf: input.cpf,
      data_nascimento: input.birthday,
      email: input.email,
      nome: input.first_name,
      sobrenome: input.last_name,
      sexo: input.gender,
      obs: input.obs,
      status: input.status,
      senha: input.password,
    });

    if (!result.length) {
      return null;
    }

    return result as unknown as { id_cliente: string }[];
  }
}
