import { inject, injectable } from "tsyringe";
import { clientAccess } from "@core/models/client/clientAccess.model";
import { MySql2Database } from "drizzle-orm/mysql2";
import * as schema from "@core/models";
import { CreateClientRequestDto } from "@core/useCases/client/dtos/CreateClientRequest.dto";
import { FindClientByCPFRepository } from "./FindClientByCPF.repository";

@injectable()
export class CreateClientRepository {
  private db: MySql2Database<typeof schema>;
  private findClientByCPF: FindClientByCPFRepository;

  constructor(
    @inject("Database") mySql2Database: MySql2Database<typeof schema>,
    findClientByCPF: FindClientByCPFRepository
  ) {
    this.db = mySql2Database;
    this.findClientByCPF = findClientByCPF;
  }

  async create(
    clientId: string,
    companyId: string
  ): Promise<{ user_id: string } | null> {
    // const result = await this.db.insert(schema.clientAccess).values({

    // }).execute();

    // if (!result.length) {
    //   return null;
    // }

    // const clientFounded = await this.findClientByCPF.find(input.cpf);

    // if (!clientFounded) {
    //   return null;
    // }

    // return { user_id: clientFounded.id_cliente } as { user_id: string };
    return null;
  }
}
