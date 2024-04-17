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
import { ClientAddressViewerRepository } from "@core/repositories/client/ClientAddressViewer.repository";
import {
  ClientAddress,
  ClientShippingAddress,
} from "@core/common/enums/models/client";
import { UpdateClientAddressRequest } from "@core/useCases/client/dtos/UpdateClientAddressRequest.dto";
import { ClientAddressCreatorRepository } from "@core/repositories/client/ClientAddressCreator.repository";
import { ClientAddressUpdaterRepository } from "@core/repositories/client/ClientAddressUpdater.repository";
import { ClientEmailActivatorRepository } from "@core/repositories/client/ClientEmailActivator.repository";
import { ClientImageUpdaterRepository } from "@core/repositories/client/ClientImageUpdater.repository";
import { ClientListerRepository } from "@core/repositories/client/ClientLister.repository";
import { ListClientRequest } from "@core/useCases/client/dtos/ListClientRequest.dto";
import { UpdateClientByIdRequestDto } from "@core/useCases/client/dtos/updateClientByIdRequest.dto";

@injectable()
export class ClientService {
  constructor(
    private readonly clientEraserRepository: ClientEraserRepository,
    private readonly clientViewerRepository: ClientViewerRepository,
    private readonly clientListerRepository: ClientListerRepository,
    private readonly clientAddressViewerRepository: ClientAddressViewerRepository,
    private readonly clientCreatorRepository: ClientCreatorRepository,
    private readonly clientAccessCreatorRepository: ClientAccessCreatorRepository,
    private readonly clientAddressCreatorRepository: ClientAddressCreatorRepository,
    private readonly clientUpdaterRepository: ClientUpdaterRepository,
    private readonly emailCreatorRepository: ClientEmailCreatorRepository,
    private readonly clientByEmailPhoneRepository: ClientByEmailPhoneRepository,
    private readonly clientPhoneUpdaterRepository: ClientPhoneUpdaterRepository,
    private readonly clientAddressUpdaterRepository: ClientAddressUpdaterRepository,
    private readonly clientEmailActivatorRepository: ClientEmailActivatorRepository,
    private readonly clientPasswordUpdaterRepository: ClientPasswordUpdaterRepository,
    private readonly clientEmailViewerByEmailRepository: ClientEmailViewerByEmailRepository,
    private readonly clientByCpfEmailPhoneRepository: ClientByCpfEmailPhoneReaderRepository,
    private readonly emailNewsletterCreatorRepository: ClientEmailNewsletterCreatorRepository,
    private readonly clientPasswordRecoveryMethodsRepository: ClientPasswordRecoveryMethodsRepository,
    private readonly clientImageUpdaterRepository: ClientImageUpdaterRepository
  ) { }

  view = async (tokenKeyData: ITokenKeyData, userId: string) => {
    return this.clientViewerRepository.view(tokenKeyData, userId);
  };

  viewBilling = async (userId: string) => {
    return this.clientAddressViewerRepository.viewBilling(userId);
  };

  viewShipping = async (userId: string) => {
    return this.clientAddressViewerRepository.viewShipping(userId);
  };

  listClientByCpfEmailPhone = async (input: FindClientByCpfEmailPhoneInput) => {
    return this.clientByCpfEmailPhoneRepository.find(input);
  };

  listWithCompanies = async (companyId: number, query: ListClientRequest) => {
    return this.clientListerRepository.listWithCompanies(companyId, query)
  }

  viewClientByEmailPhone = async (input: FindClientByEmailPhoneInput) => {
    return this.clientByEmailPhoneRepository.find(input);
  };

  create = async (input: CreateClientRequestDto) => {
    return this.clientCreatorRepository.create(input);
  };

  createAddress = async (
    userId: string,
    data: UpdateClientAddressRequest,
    clientAddress: ClientAddress
  ) => {
    return this.clientAddressCreatorRepository.createAddress(
      userId,
      data,
      clientAddress
    );
  };

  connectClientAndCompany = async (input: IClientConnectClientAndCompany) => {
    return this.clientAccessCreatorRepository.create(input);
  };

  update = async (clientId: string, input: UpdateClientRequestDto) => {
    return this.clientUpdaterRepository.update(clientId, input);
  };

  updateById = async (clientId: string, input: UpdateClientByIdRequestDto) => {
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

  updateAddress = async (
    userId: string,
    data: UpdateClientAddressRequest,
    clientAddress: ClientAddress
  ) => {
    return this.clientAddressUpdaterRepository.updateAddress(
      userId,
      data,
      clientAddress
    );
  };

  updateShippingAddress = async (
    userId: string,
    type: ClientAddress,
    shippingAddress: ClientShippingAddress
  ) => {
    return this.clientAddressUpdaterRepository.updateShippingAddress(
      userId,
      type,
      shippingAddress
    );
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

  activateEmail = async (token: string) => {
    return this.clientEmailActivatorRepository.activate(token);
  };

  updateImage = async (clientId: string, storageUrl: string) => {
    return this.clientImageUpdaterRepository.update(clientId, storageUrl);
  };
}
