import { ClientRepository } from "@core/repositories/client/client.repository";
import { injectable } from "tsyringe";

@injectable()
export class AuthService {
  private clientRepository: ClientRepository;

  constructor(clientRepository: ClientRepository) {
    this.clientRepository = clientRepository;
  }

  authenticate = async (login: string, password: string) => {
    try {
      return await this.clientRepository.authenticate(login, password);
    } catch (error) {
      throw error;
    }
  };
}
