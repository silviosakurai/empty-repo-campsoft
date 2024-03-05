import { ClientService } from "@core/services/client.service";
import { injectable } from "tsyringe";
import { CreateClientRequestDto } from "./dtos/CreateClientRequest.dto";

@injectable()
export class CreateClientUseCase {
  private clientService: ClientService;

  constructor(clientService: ClientService) {
    this.clientService = clientService;
  }

  async execute(input: CreateClientRequestDto) {
    console.log("chegou aquiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiii");
    return this.confirmIfUserExists({
      cpf: input.cpf,
      email: input.email,
      phone: input.phone,
    });
  }

  private async confirmIfUserExists(input: IUserExistsFunction) {
    return await this.clientService.readClientByCpfEmailPhone(input);
  }
}

interface IUserExistsFunction {
  email: string;
  cpf: string;
  phone: string;
}
