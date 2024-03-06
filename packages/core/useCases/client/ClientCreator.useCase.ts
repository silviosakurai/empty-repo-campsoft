import { ClientService } from "@core/services/client.service";
import { injectable } from "tsyringe";
import { CreateClientRequestDto } from "./dtos/CreateClientRequest.dto";
import { AccessService } from "@core/services/access.service";
import { AccessType } from "@core/common/enums/models/access";

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

    const userCreated = await this.clientService.create(input);

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
