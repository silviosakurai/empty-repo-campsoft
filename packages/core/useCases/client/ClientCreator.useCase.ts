import { ClientService } from "@core/services/client.service";
import { injectable } from "tsyringe";
import { CreateClientRequestDto } from "@core/useCases/client/dtos/CreateClientRequest.dto";
import { AccessService } from "@core/services/access.service";
import { AccessType } from "@core/common/enums/models/access";
import { encodePassword } from "@core/common/functions/encodePassword";
import { InternalServerError } from "@core/common/exceptions/InternalServerError";
import { ViewApiTfaResponse } from "@core/useCases/api/dtos/ViewApiTfaResponse.dto";
import { TFAType } from "@core/common/enums/models/tfa";

@injectable()
export class ClientCreatorUseCase {
  private clientService: ClientService;
  private accessService: AccessService;

  constructor(clientService: ClientService, accessService: AccessService) {
    this.clientService = clientService;
    this.accessService = accessService;
  }

  async create(
    companyId: number,
    input: CreateClientRequestDto
  ): Promise<{ user_id: string } | null> {
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
      companyId,
    });

    await this.accessService.create({
      clientId: userCreated.user_id,
      companyId,
      accessTypeId: AccessType.GENERAL,
    });

    return userCreated;
  }

  validateTypeTfa(
    tfaInfo: ViewApiTfaResponse,
    input: CreateClientRequestDto
  ): boolean {
    if (tfaInfo.type === TFAType.EMAIL && tfaInfo.destiny !== input.email) {
      return false;
    }

    if (
      (tfaInfo.type === TFAType.SMS || tfaInfo.type === TFAType.WHATSAPP) &&
      tfaInfo.destiny !== input.phone
    ) {
      return false;
    }

    return true;
  }

  private async confirmIfRegisteredPreviously(input: IUserExistsFunction) {
    const response = await this.clientService.readClientByCpfEmailPhone(input);

    if (response) return true;

    return false;
  }
}

interface IUserExistsFunction {
  email: string;
  cpf: string;
  phone: string;
}
