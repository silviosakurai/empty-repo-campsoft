import ClientRepository from "@core/repositories/client/client.repository";
import { MySql2Database } from "drizzle-orm/mysql2";
import * as schema from "@core/models";

export class ClientService {
  private clientRepository: ClientRepository;

  constructor(client: MySql2Database<typeof schema>) {
    this.clientRepository = new ClientRepository(client);
  }

  findClientByCPF = async (cpf: string) => {
    try {
      return await this.clientRepository.findClientByCPF(cpf);
    } catch (error) {
      throw error;
    }
  };
}
