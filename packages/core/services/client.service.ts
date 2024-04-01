import { IClientConnectClientAndCompany } from "@core/interfaces/services/IClient.service";
import { ClientCreatorRepository } from "@core/repositories/client/ClientCreator.repository";
import { ClientAccessCreatorRepository } from "@core/repositories/client/ClientAccessCreator.repository";
import { ClientByCpfEmailPhoneReaderRepository } from "@core/repositories/client/ClientByCPFEmailPhoneReader.repository";
import { ClientPasswordRecoveryMethodsRepository } from "@core/repositories/client/ClientPasswordRecoveryMethods.repository";
import { ClientViewerRepository } from "@core/repositories/client/ClientViewer.repository";
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
import { ClientEraserRepository } from "@core/repositories/client/ClientEraser.repository";
import { ITokenJwtData } from "@core/common/interfaces/ITokenJwtData";
import { ViewClientResponse } from "@core/useCases/client/dtos/ViewClientResponse.dto";

@injectable()
export class ClientService {
  constructor(
    private readonly clientByCpfEmailPhoneRepository: ClientByCpfEmailPhoneReaderRepository,
    private readonly clientViewerRepository: ClientViewerRepository,
    private readonly clientCreatorRepository: ClientCreatorRepository,
    private readonly clientAccessCreatorRepository: ClientAccessCreatorRepository,
    private readonly clientUpdaterRepository: ClientUpdaterRepository,
    private readonly clientPhoneUpdaterRepository: ClientPhoneUpdaterRepository,
    private readonly clientPasswordRecoveryMethodsRepository: ClientPasswordRecoveryMethodsRepository,
    private readonly clientPasswordUpdaterRepository: ClientPasswordUpdaterRepository,
    private readonly clientByEmailPhoneRepository: ClientByEmailPhoneRepository,
    private readonly clientEraserRepository: ClientEraserRepository
  ) {}

  view = async (tokenKeyData: ITokenKeyData, userId: string) => {
    return await this.clientViewerRepository.view(tokenKeyData, userId);
  };

  listClientByCpfEmailPhone = async (input: FindClientByCpfEmailPhoneInput) => {
    return await this.clientByCpfEmailPhoneRepository.find(input);
  };

  viewClientByEmailPhone = async (input: FindClientByEmailPhoneInput) => {
    return await this.clientByEmailPhoneRepository.find(input);
  };

  create = async (input: CreateClientRequestDto) => {
    return await this.clientCreatorRepository.create(input);
  };

  connectClientAndCompany = async (input: IClientConnectClientAndCompany) => {
    return await this.clientAccessCreatorRepository.create(input);
  };

  update = async (clientId: string, input: UpdateClientRequestDto) => {
    return await this.clientUpdaterRepository.update(clientId, input);
  };

  updatePhone = async (
    clientId: string,
    input: UpdatePhoneClientRequestDto
  ) => {
    return await this.clientPhoneUpdaterRepository.update(clientId, input);
  };

  updatePassword = async (tokenTfaData: ITokenTfaData, newPass: string) => {
    return await this.clientPasswordUpdaterRepository.update(
      tokenTfaData,
      newPass
    );
  };

  passwordRecoveryMethods = async (
    tokenKeyData: ITokenKeyData,
    login: string
  ) => {
    return await this.clientPasswordRecoveryMethodsRepository.passwordRecoveryMethods(
      tokenKeyData,
      login
    );
  };

  delete = async (
    tokenJwtData: ITokenJwtData,
    userFounded: ViewClientResponse
  ) => {
    return await this.clientEraserRepository.delete(tokenJwtData, userFounded);
  };
}
