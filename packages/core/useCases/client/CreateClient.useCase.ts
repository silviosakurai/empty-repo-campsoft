import { ClientService } from "@core/services/client.service";
import { injectable } from "tsyringe";
import { CreateClientRequestDto } from "./dtos/CreateClientRequest.dto";

@injectable()
export class CreateClientUseCase {
  private clientService: ClientService;

  constructor(clientService: ClientService) {
    this.clientService = clientService;
  }

  async execute(
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
