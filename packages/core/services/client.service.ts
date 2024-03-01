import { ClientRepository } from "@core/repositories/client/client.repository";
import { injectable } from "tsyringe";

@injectable()
export class ClientService {
  private clientRepository: ClientRepository;

  constructor(clientRepository: ClientRepository) {
    this.clientRepository = clientRepository;
  }

  findClientByCPF = async (cpf: string) => {
    try {
      return await this.clientRepository.findClientByCPF(cpf);
    } catch (error) {
      throw error;
    }
  };
}
