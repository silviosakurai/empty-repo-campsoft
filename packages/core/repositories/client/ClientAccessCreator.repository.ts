import { inject, injectable } from "tsyringe";
import { MySql2Database } from "drizzle-orm/mysql2";
import * as schema from "@core/models";
import { IClientConnectClientAndCompany } from "@core/interfaces/services/IClient.service";
import { sql } from "drizzle-orm";

@injectable()
export class ClientAccessCreatorRepository {
  constructor(@inject("Database") private db: MySql2Database<typeof schema>) {}

  async create(input: IClientConnectClientAndCompany): Promise<boolean> {
    const result = await this.db
      .insert(schema.clientCompanyData)
      .values({
        id_cliente: sql`UUID_TO_BIN(${input.clientId})`,
        id_empresa: input.companyId,
        cpf: input.cpf,
        telefone: input.phoneNumber,
        status: input.status,
      })
      .execute();

    if (!result.length) {
      return false;
    }

    return true;
  }
}
