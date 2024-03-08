import { IClientConnectClientAndCompany } from "@core/interfaces/services/IClient.service";
import { ClientCreatorRepository } from "@core/repositories/client/ClientCreator.repository";
import { ClientAccessCreatorRepository } from "@core/repositories/client/ClientAccessCreator.repository";
import { ClientByCpfEmailPhoneReaderRepository } from "@core/repositories/client/ClientByCPFEmailPhoneReader.repository";
import { ClientViewRepository } from "@core/repositories/client/ClientView.repository";
import { ViewApiResponse } from "@core/useCases/api/dtos/ViewApiResponse.dto";
import { CreateClientRequestDto } from "@core/useCases/client/dtos/CreateClientRequest.dto";
import { injectable } from "tsyringe";
import { ClientUpdaterRepository } from "@core/repositories/client/ClientUpdater.repository";
import { UpdateClientRequestDto } from "@core/useCases/client/dtos/UpdateClientRequest.dto";
import { UpdatePhoneClientRequestDto } from "@core/useCases/client/dtos/UpdatePhoneClientRequest.dto";
import { ClientPhoneUpdaterRepository } from "@core/repositories/client/ClientPhoneUpdater.repository";
import { FindClientByCpfEmailPhoneInput } from "@core/interfaces/repositories/client";

@injectable()
export class ClientService {
  private clientByCpfEmailPhoneRepository: ClientByCpfEmailPhoneReaderRepository;
  private clientViewRepository: ClientViewRepository;
  private clientCreatorRepository: ClientCreatorRepository;
  private clientAccessCreatorRepository: ClientAccessCreatorRepository;
  private clientUpdaterRepository: ClientUpdaterRepository;
  private clientPhoneUpdaterRepository: ClientPhoneUpdaterRepository;

  constructor(
    clientByCpfEmailPhoneRepository: ClientByCpfEmailPhoneReaderRepository,
    clientViewRepository: ClientViewRepository,
    clientCreatorRepository: ClientCreatorRepository,
    clientAccessCreatorRepository: ClientAccessCreatorRepository,
    clientUpdaterRepository: ClientUpdaterRepository,
    clientPhoneUpdaterRepository: ClientPhoneUpdaterRepository,
  ) {
    this.clientByCpfEmailPhoneRepository = clientByCpfEmailPhoneRepository;
    this.clientViewRepository = clientViewRepository;
    this.clientCreatorRepository = clientCreatorRepository;
    this.clientAccessCreatorRepository = clientAccessCreatorRepository;
    this.clientUpdaterRepository = clientUpdaterRepository;
    this.clientPhoneUpdaterRepository = clientPhoneUpdaterRepository;
  }

  viewClient = async (apiAccess: ViewApiResponse, userId: string) => {
    try {
      return await this.clientViewRepository.view(apiAccess, userId);
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
      return await this.clientCreatorRepository.create(input);
    } catch (error) {
      throw error;
    }
  };

  connectClientAndCompany= async (input: IClientConnectClientAndCompany) => {
    try {
      return await this.clientAccessCreatorRepository.create(input);
    } catch (error) {
      throw error;
    }
  }

  update = async (clientId: string, input: UpdateClientRequestDto) => {
    try {
      return await this.clientUpdaterRepository.update(clientId, input);
    } catch (error) {
      throw error;
    }
  };

  updatePhone = async (clientId: string, input: UpdatePhoneClientRequestDto) => {
    try {
      return await this.clientPhoneUpdaterRepository.update(clientId, input);
    } catch (error) {
      throw error;
    }
  };
}
