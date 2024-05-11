import { ClientService } from "@core/services/client.service";
import { injectable } from "tsyringe";
import { CreateClientRequestDto } from "@core/useCases/client/dtos/CreateClientRequest.dto";
import { encodePassword } from "@core/common/functions/encodePassword";
import { InternalServerError } from "@core/common/exceptions/InternalServerError";
import { TFAType } from "@core/common/enums/models/tfa";
import { ITokenTfaData } from "@core/common/interfaces/ITokenTfaData";
import { ClientCompanyStatus } from "@core/common/enums/models/clientCompany";
import { CreateClientResponse } from "@core/useCases/client/dtos/CreateClientResponse.dto";
import { IUserExistsFunction } from "@core/interfaces/repositories/client";
import { EmailService, WhatsappService } from "@core/services";
import { ITokenKeyData } from "@core/common/interfaces/ITokenKeyData";
import { NotificationTemplate } from "@core/interfaces/services/IClient.service";
import { IReplaceTemplate } from "@core/common/interfaces/IReplaceTemplate";
import { TemplateModulo } from "@core/common/enums/TemplateMessage";
import { PermissionService } from "@core/services/permission.service";

@injectable()
export class ClientCreatorUseCase {
  constructor(
    private readonly clientService: ClientService,
    private readonly emailService: EmailService,
    private readonly whatsappService: WhatsappService,
    private readonly permissionService: PermissionService
  ) {}

  async create(
    tokenKeyData: ITokenKeyData,
    input: CreateClientRequestDto
  ): Promise<CreateClientResponse | null> {
    const response = await this.confirmIfRegisteredPreviously({
      cpf: input.cpf,
      email: input.email,
      phone: input.phone,
    });

    if (response) {
      return null;
    }

    const passwordHashed = encodePassword(input.password);

    if (!passwordHashed) {
      throw new InternalServerError("Internal Server Error.");
    }

    const userCreated = await this.clientService.create({
      ...input,
      password: passwordHashed,
      companyId: tokenKeyData.id_parceiro,
    });

    if (!userCreated) {
      return null;
    }

    const [permissionCreated, connectClientAndCompany] = await Promise.all([
      this.permissionService.create(userCreated.user_id),
      this.clientService.connectClientAndCompany({
        clientId: userCreated.user_id,
        companyId: tokenKeyData.id_parceiro,
        cpf: input.cpf,
        email: input.email,
        phoneNumber: input.phone,
        status: ClientCompanyStatus.ACTIVE,
      }),
    ]);

    if (!permissionCreated || !connectClientAndCompany) {
      return null;
    }

    this.sendNotification(tokenKeyData, input);

    return userCreated;
  }

  private sendNotification(
    tokenKeyData: ITokenKeyData,
    input: CreateClientRequestDto
  ) {
    const notificationTemplate = {
      email: input.email,
      phoneNumber: input.phone,
    } as NotificationTemplate;

    const replaceTemplate = {
      name: input.first_name ?? input.last_name,
    } as IReplaceTemplate;

    this.emailService.sendEmail(
      tokenKeyData,
      notificationTemplate,
      TemplateModulo.CADASTRO,
      replaceTemplate
    );

    this.whatsappService.sendWhatsapp(
      tokenKeyData,
      notificationTemplate,
      TemplateModulo.CADASTRO,
      replaceTemplate
    );
  }

  validateTypeTfa(
    tokenTfaData: ITokenTfaData,
    input: CreateClientRequestDto
  ): boolean {
    if (
      tokenTfaData.type === TFAType.EMAIL &&
      tokenTfaData.destiny !== input.email
    ) {
      return false;
    }

    if (
      (tokenTfaData.type === TFAType.SMS ||
        tokenTfaData.type === TFAType.WHATSAPP) &&
      tokenTfaData.destiny !== input.phone
    ) {
      return false;
    }

    return true;
  }

  private async confirmIfRegisteredPreviously(input: IUserExistsFunction) {
    const response = await this.clientService.listClientByCpfEmailPhone(input);

    if (response) return true;

    return false;
  }
}
