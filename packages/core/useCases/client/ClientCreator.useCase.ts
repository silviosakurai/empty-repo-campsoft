import { ClientService } from "@core/services/client.service";
import { injectable } from "tsyringe";
import { CreateClientRequestDto } from "@core/useCases/client/dtos/CreateClientRequest.dto";
import { AccessService } from "@core/services/access.service";
import { AccessType } from "@core/common/enums/models/access";
import { encodePassword } from "@core/common/functions/encodePassword";
import { InternalServerError } from "@core/common/exceptions/InternalServerError";
import { TFAType } from "@core/common/enums/models/tfa";
import { ITokenTfaData } from "@core/common/interfaces/ITokenTfaData";
import { ClientCompanyStatus } from "@core/common/enums/models/clientCompany";
import { CreateClientResponse } from "@core/useCases/client/dtos/CreateClientResponse.dto";
import { IUserExistsFunction } from "@core/interfaces/repositories/client";
import { EmailService } from "@core/services";
import { ITokenKeyData } from "@core/common/interfaces/ITokenKeyData";
import { LoginEmail } from "@core/interfaces/services/IClient.service";
import { IReplaceTemplate } from "@core/common/interfaces/IReplaceTemplate";
import { TemplateModulo } from "@core/common/enums/TemplateMessage";

@injectable()
export class ClientCreatorUseCase {
  constructor(
    private readonly clientService: ClientService,
    private readonly accessService: AccessService,
    private readonly emailService: EmailService
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
    });

    if (!userCreated) {
      return null;
    }

    await this.clientService.connectClientAndCompany({
      clientId: userCreated.user_id,
      companyId: tokenKeyData.company_id,
      cpf: input.cpf,
      email: input.email,
      phoneNumber: input.phone,
      status: ClientCompanyStatus.ACTIVE,
    });

    await this.accessService.create({
      clientId: userCreated.user_id,
      companyId: tokenKeyData.company_id,
      accessTypeId: AccessType.GENERAL,
    });

    const loginEmail = {
      email: input.email,
    } as LoginEmail;

    const replaceTemplate = {
      name: input.first_name ?? input.last_name,
    } as IReplaceTemplate;

    await this.emailService.sendEmail(
      tokenKeyData,
      loginEmail,
      TemplateModulo.CADASTRO,
      replaceTemplate
    );

    return userCreated;
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
