import { ClientRepository } from "@core/repositories/client/client.repository";
import { injectable } from "tsyringe";

@injectable()
export class ClientService {
  private clientRepository: ClientRepository;

  constructor(clientRepository: ClientRepository) {
    this.clientRepository = clientRepository;
  }

  viewClient = async (userId: string) => {
    try {
      return await this.clientRepository.viewClient(userId);
    } catch (error) {
      throw error;
    }
  };
}
