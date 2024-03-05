import {
  FindClientByCpfEmailPhoneInput,
  ReadClientByCpfEmailPhoneRepository,
} from "@core/repositories/client/ReadClientByCPFEmailPhone.repository";
import { ClientRepository } from "@core/repositories/client/client.repository";
import { CreateClientRequestDto } from "@core/useCases/client/dtos/CreateClientRequest.dto";
import { injectable } from "tsyringe";

@injectable()
export class ClientService {
  private clientRepository: ClientRepository;
  private clientByCpfEmailPhoneRepository: ReadClientByCpfEmailPhoneRepository;

  constructor(
    clientRepository: ClientRepository,
    clientByCpfEmailPhoneRepository: ReadClientByCpfEmailPhoneRepository
  ) {
    this.clientRepository = clientRepository;
    this.clientByCpfEmailPhoneRepository = clientByCpfEmailPhoneRepository;
  }

  viewClient = async (userId: string) => {
    try {
      return await this.clientRepository.viewClient(userId);
    } catch (error) {
      throw error;
    }
  };

  async readClientByCpfEmailPhone(input: FindClientByCpfEmailPhoneInput) {
    try {
      return await this.clientByCpfEmailPhoneRepository.find(input);
    } catch (error) {
      throw error;
    }
  }
}
