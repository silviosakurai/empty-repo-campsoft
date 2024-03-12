import { IClientConnectClientAndCompany } from "@core/interfaces/services/IClient.service";
import { ClientCreatorRepository } from "@core/repositories/client/ClientCreator.repository";
import { ClientAccessCreatorRepository } from "@core/repositories/client/ClientAccessCreator.repository";
import { ClientByCpfEmailPhoneReaderRepository } from "@core/repositories/client/ClientByCPFEmailPhoneReader.repository";
import { ClientPasswordRecoveryMethodsRepository } from "@core/repositories/client/ClientPasswordRecoveryMethods.repository";
import { ClientViewRepository } from "@core/repositories/client/ClientView.repository";
import { CreateClientRequestDto } from "@core/useCases/client/dtos/CreateClientRequest.dto";
import { injectable } from "tsyringe";
import { ClientUpdaterRepository } from "@core/repositories/client/ClientUpdater.repository";
import { UpdateClientRequestDto } from "@core/useCases/client/dtos/UpdateClientRequest.dto";
import { UpdatePhoneClientRequestDto } from "@core/useCases/client/dtos/UpdatePhoneClientRequest.dto";
import { ClientPhoneUpdaterRepository } from "@core/repositories/client/ClientPhoneUpdater.repository";
import {
  FindClientByCpfEmailPhoneInput,
  FindClientByEmailPhoneInput,
} from "@core/interfaces/repositories/client";
import { ClientPasswordUpdaterRepository } from "@core/repositories/client/ClientPasswordUpdater.repository";
import { ITokenKeyData } from "@core/common/interfaces/ITokenKeyData";
import { ITokenTfaData } from "@core/common/interfaces/ITokenTfaData";
import { ClientByEmailPhoneRepository } from "@core/repositories/client/ClientByEmailPhone.repository";
import { ClientDeleteRepository } from "@core/repositories/client/ClientDelete.repository";
import { ITokenJwtData } from "@core/common/interfaces/ITokenJwtData";
import { ViewClientResponse } from "@core/useCases/client/dtos/ViewClientResponse.dto";

@injectable()
export class ClientService {
  private clientByCpfEmailPhoneRepository: ClientByCpfEmailPhoneReaderRepository;
  private clientViewRepository: ClientViewRepository;
  private clientCreatorRepository: ClientCreatorRepository;
  private clientAccessCreatorRepository: ClientAccessCreatorRepository;
  private clientUpdaterRepository: ClientUpdaterRepository;
  private clientPhoneUpdaterRepository: ClientPhoneUpdaterRepository;
  private clientPasswordRecoveryMethodsRepository: ClientPasswordRecoveryMethodsRepository;
  private clientPasswordUpdaterRepository: ClientPasswordUpdaterRepository;
  private clientByEmailPhoneRepository: ClientByEmailPhoneRepository;
  private clientDeleteRepository: ClientDeleteRepository;

  constructor(
    clientByCpfEmailPhoneRepository: ClientByCpfEmailPhoneReaderRepository,
    clientViewRepository: ClientViewRepository,
    clientCreatorRepository: ClientCreatorRepository,
    clientAccessCreatorRepository: ClientAccessCreatorRepository,
    clientUpdaterRepository: ClientUpdaterRepository,
    clientPhoneUpdaterRepository: ClientPhoneUpdaterRepository,
    clientPasswordRecoveryMethodsRepository: ClientPasswordRecoveryMethodsRepository,
    clientPasswordUpdaterRepository: ClientPasswordUpdaterRepository,
    clientByEmailPhoneRepository: ClientByEmailPhoneRepository,
    clientDeleteRepository: ClientDeleteRepository
  ) {
    this.clientByCpfEmailPhoneRepository = clientByCpfEmailPhoneRepository;
    this.clientViewRepository = clientViewRepository;
    this.clientCreatorRepository = clientCreatorRepository;
    this.clientAccessCreatorRepository = clientAccessCreatorRepository;
    this.clientUpdaterRepository = clientUpdaterRepository;
    this.clientPhoneUpdaterRepository = clientPhoneUpdaterRepository;
    this.clientPasswordRecoveryMethodsRepository =
      clientPasswordRecoveryMethodsRepository;
    this.clientPasswordUpdaterRepository = clientPasswordUpdaterRepository;
    this.clientByEmailPhoneRepository = clientByEmailPhoneRepository;
    this.clientDeleteRepository = clientDeleteRepository;
  }

  viewClient = async (tokenKeyData: ITokenKeyData, userId: string) => {
    try {
      return await this.clientViewRepository.view(tokenKeyData, userId);
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

  findClientByEmailPhone = async (input: FindClientByEmailPhoneInput) => {
    try {
      return await this.clientByEmailPhoneRepository.find(input);
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

  connectClientAndCompany = async (input: IClientConnectClientAndCompany) => {
    try {
      return await this.clientAccessCreatorRepository.create(input);
    } catch (error) {
      throw error;
    }
  };

  update = async (clientId: string, input: UpdateClientRequestDto) => {
    try {
      return await this.clientUpdaterRepository.update(clientId, input);
    } catch (error) {
      throw error;
    }
  };

  updatePhone = async (
    clientId: string,
    input: UpdatePhoneClientRequestDto
  ) => {
    try {
      return await this.clientPhoneUpdaterRepository.update(clientId, input);
    } catch (error) {
      throw error;
    }
  };

  updatePassword = async (tokenTfaData: ITokenTfaData, newPass: string) => {
    try {
      return await this.clientPasswordUpdaterRepository.update(
        tokenTfaData,
        newPass
      );
    } catch (error) {
      throw error;
    }
  };

  passwordRecoveryMethods = async (
    tokenKeyData: ITokenKeyData,
    login: string
  ) => {
    try {
      return await this.clientPasswordRecoveryMethodsRepository.passwordRecoveryMethods(
        tokenKeyData,
        login
      );
    } catch (error) {
      throw error;
    }
  };

  delete = async (
    tokenJwtData: ITokenJwtData,
    userFounded: ViewClientResponse
  ) => {
    try {
      return await this.clientDeleteRepository.delete(
        tokenJwtData,
        userFounded
      );
    } catch (error) {
      throw error;
    }
  };
}
