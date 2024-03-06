import { IClientConnectClientAndCompany } from "@core/interfaces/services/IClient.service";
import { CreateClientRepository } from "@core/repositories/client/CreateClient.repository";
import { CreateClientAccessRepository } from "@core/repositories/client/CreateClientAccess.repository";
import {
  FindClientByCpfEmailPhoneInput,
  ReadClientByCpfEmailPhoneRepository,
} from "@core/repositories/client/ReadClientByCPFEmailPhone.repository";
import { ViewClientRepository } from "@core/repositories/client/view.repository";
import { ViewApiResponse } from "@core/useCases/api/dtos/ViewApiResponse.dto";
import { CreateClientRequestDto } from "@core/useCases/client/dtos/CreateClientRequest.dto";
import { injectable } from "tsyringe";

@injectable()
export class ClientService {
  private clientByCpfEmailPhoneRepository: ReadClientByCpfEmailPhoneRepository;
  private viewClientRepository: ViewClientRepository;
  private createClientRepository: CreateClientRepository;
  private createClientAccessRepository: CreateClientAccessRepository;

  constructor(
    clientByCpfEmailPhoneRepository: ReadClientByCpfEmailPhoneRepository,
    viewClientRepository: ViewClientRepository,
    createClientRepository: CreateClientRepository,
    createClientAccessRepository: CreateClientAccessRepository
  ) {
    this.clientByCpfEmailPhoneRepository = clientByCpfEmailPhoneRepository;
    this.viewClientRepository = viewClientRepository;
    this.createClientRepository = createClientRepository;
    this.createClientAccessRepository = createClientAccessRepository;
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

  create = async (input: CreateClientRequestDto) => {
    try {
      return await this.createClientRepository.create(input);
    } catch (error) {
      throw error;
    }
  };

  connectClientAndCompany(input: IClientConnectClientAndCompany) {
    try {
      return this.createClientAccessRepository.create(input);
    } catch (error) {
      throw error;
    }
  }
}
