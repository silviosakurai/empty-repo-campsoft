import { inject, injectable } from "tsyringe";
import * as schema from "@core/models";
import { MySql2Database } from "drizzle-orm/mysql2";
import { client } from "@core/models";
import { CreateClientRequestDto } from "@core/useCases/client/dtos/CreateClientRequest.dto";
import { ClientByCPFFinderRepository } from "./ClientByCPFFinder.repository";

@injectable()
export class ClientCreatorRepository {
  private db: MySql2Database<typeof schema>;
  private findClientByCPF: ClientByCPFFinderRepository;

  constructor(
    @inject("Database") mySql2Database: MySql2Database<typeof schema>,
    findClientByCPF: ClientByCPFFinderRepository
  ) {
    this.db = mySql2Database;
    this.findClientByCPF = findClientByCPF;
  }

  async create(
    input: CreateClientRequestDto
  ): Promise<{ user_id: string } | null> {
    const result = await this.db
      .insert(client)
      .values({
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
      })
      .execute();

    if (!result.length) {
      return null;
    }

    const clientFounded = await this.findClientByCPF.find(input.cpf);

    if (!clientFounded) {
      return null;
    }

    return { user_id: clientFounded.id_cliente } as { user_id: string };
  }
}
