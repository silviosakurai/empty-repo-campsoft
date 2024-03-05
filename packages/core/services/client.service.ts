import {
  FindClientByCpfEmailPhoneInput,
  ReadClientByCpfEmailPhoneRepository,
} from "@core/repositories/client/ReadClientByCPFEmailPhone.repository";
import { ViewClientRepository } from "@core/repositories/client/view.repository";
import { ViewApiResponse } from "@core/useCases/api/dtos/ViewApiResponse.dto";
import { injectable } from "tsyringe";

@injectable()
export class ClientService {
  private clientByCpfEmailPhoneRepository: ReadClientByCpfEmailPhoneRepository;
  private viewClientRepository: ViewClientRepository;

  constructor(
    clientByCpfEmailPhoneRepository: ReadClientByCpfEmailPhoneRepository,
    viewClientRepository: ViewClientRepository
  ) {
    this.clientByCpfEmailPhoneRepository = clientByCpfEmailPhoneRepository;
    this.viewClientRepository = viewClientRepository;
  }

  viewClient = async (apiAccess: ViewApiResponse, userId: string) => {
    try {
      return await this.viewClientRepository.view(apiAccess, userId);
    } catch (error) {
      throw error;
    }
  };

  readClientByCpfEmailPhone = async (input: FindClientByCpfEmailPhoneInput) => {
    try {
      return await this.clientByCpfEmailPhoneRepository.find(input);
    } catch (error) {
      throw error;
    }
  };

  create = async () => {
    try {
    } catch (error) {
      throw error;
    }
  };
}
