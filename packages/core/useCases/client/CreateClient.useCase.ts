import { ClientService } from "@core/services/client.service";
import { injectable } from "tsyringe";

@injectable()
export class CreateClientUseCase {
  private clientService: ClientService;

  constructor(clientService: ClientService) {
    this.clientService = clientService;
  }

  private confirmIfUserExists(input: IUserExistsFunction) {}
}

interface IUserExistsFunction {
  email: string;
  cpf: string;
  phoneNumber: string;
}
