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
  ClientEmailCreatorInput,
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
import { ClientEmailNewsletterCreatorRepository } from "@core/repositories/client/ClientEmailNewsletterCreator.repository";
import { ClientEmailViewerByEmailRepository } from "@core/repositories/client/ClientEmailViewerByEmail.repository";
import { ClientEmailCreatorRepository } from "@core/repositories/client/ClientEmailCreator.repository";

@injectable()
export class ClientService {
  constructor(
    private readonly clientEraserRepository: ClientEraserRepository,
    private readonly clientViewerRepository: ClientViewerRepository,
    private readonly clientCreatorRepository: ClientCreatorRepository,
    private readonly clientUpdaterRepository: ClientUpdaterRepository,
    private readonly emailCreatorRepository: ClientEmailCreatorRepository,
    private readonly clientByEmailPhoneRepository: ClientByEmailPhoneRepository,
    private readonly clientPhoneUpdaterRepository: ClientPhoneUpdaterRepository,
    private readonly clientAccessCreatorRepository: ClientAccessCreatorRepository,
    private readonly clientPasswordUpdaterRepository: ClientPasswordUpdaterRepository,
    private readonly clientEmailViewerByEmailRepository: ClientEmailViewerByEmailRepository,
    private readonly clientByCpfEmailPhoneRepository: ClientByCpfEmailPhoneReaderRepository,
    private readonly emailNewsletterCreatorRepository: ClientEmailNewsletterCreatorRepository,
    private readonly clientPasswordRecoveryMethodsRepository: ClientPasswordRecoveryMethodsRepository
  ) {}

  view = async (tokenKeyData: ITokenKeyData, userId: string) => {
    return this.clientViewerRepository.view(tokenKeyData, userId);
  };

  listClientByCpfEmailPhone = async (input: FindClientByCpfEmailPhoneInput) => {
    return this.clientByCpfEmailPhoneRepository.find(input);
  };

  viewClientByEmailPhone = async (input: FindClientByEmailPhoneInput) => {
    return this.clientByEmailPhoneRepository.find(input);
  };

  create = async (input: CreateClientRequestDto) => {
    return this.clientCreatorRepository.create(input);
  };

  connectClientAndCompany = async (input: IClientConnectClientAndCompany) => {
    return this.clientAccessCreatorRepository.create(input);
  };

  update = async (clientId: string, input: UpdateClientRequestDto) => {
    return this.clientUpdaterRepository.update(clientId, input);
  };

  updatePhone = async (
    clientId: string,
    input: UpdatePhoneClientRequestDto
  ) => {
    return this.clientPhoneUpdaterRepository.update(clientId, input);
  };

  updatePassword = async (tokenTfaData: ITokenTfaData, newPass: string) => {
    return this.clientPasswordUpdaterRepository.update(tokenTfaData, newPass);
  };

  passwordRecoveryMethods = async (
    tokenKeyData: ITokenKeyData,
    login: string
  ) => {
    return this.clientPasswordRecoveryMethodsRepository.passwordRecoveryMethods(
      tokenKeyData,
      login
    );
  };

  delete = async (
    tokenJwtData: ITokenJwtData,
    userFounded: ViewClientResponse
  ) => {
    return this.clientEraserRepository.delete(tokenJwtData, userFounded);
  };

  createEmailNewsletter = async (
    clientId: string,
    clientEmailTypeId: number
  ) => {
    return this.emailNewsletterCreatorRepository.create(
      clientId,
      clientEmailTypeId
    );
  };

  clientEmailViewByEmail = async (email: string) => {
    return this.clientEmailViewerByEmailRepository.view(email);
  };

  createEmail = async (input: ClientEmailCreatorInput) => {
    return this.emailCreatorRepository.create(input);
  };
}
