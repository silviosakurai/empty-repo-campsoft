import { ClientService } from "@core/services";
import { ListClienttGroupedByCompanyResponse } from "./dtos/ListClientResponse.dto";
import { ListClientRequest } from "./dtos/ListClientRequest.dto";
import { injectable } from "tsyringe";

@injectable()
export class ClientsWithCompaniesListerUseCase {
  constructor(private readonly clientService: ClientService) { }

  async execute(
    companyId: number,
    query: ListClientRequest
  ): Promise<ListClienttGroupedByCompanyResponse | null> {
    return this.clientService.listWithCompanies(companyId, query);
  }
}