import { ApiService } from "@core/services/api.service";
import { ClientService } from "@core/services/client.service";
import { injectable } from "tsyringe";
import { ViewApiTfaRequest } from "@core/useCases/api/dtos/ViewApiTfaRequest.dto";
import { ITokenTfaData } from "@core/common/interfaces/ITokenTfaData";

@injectable()
export class ApiTfaViewerUseCase {
  constructor(
    private readonly apiService: ApiService,
    private readonly clientService: ClientService
  ) {}

  async execute({ token }: ViewApiTfaRequest): Promise<ITokenTfaData | null> {
    const findTfa = await this.apiService.findApiByTfa(token);

    if (!findTfa) {
      return null;
    }

    const findUserId = await this.clientService.viewClientByEmailPhone({
      email: findTfa.destiny,
      phone: findTfa.destiny,
    });

    if (findUserId) {
      findTfa.clientId = findUserId.id_cliente;
    }

    return findTfa;
  }
}
