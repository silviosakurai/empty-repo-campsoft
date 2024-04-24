import { ClientService } from "@core/services";
import { ListClienttGroupedByCompanyResponse } from "./dtos/ListClientResponse.dto";
import { ListClientRequest } from "./dtos/ListClientRequest.dto";
import { injectable } from "tsyringe";
import { Permissions } from "@core/common/enums/Permissions";
import { ControlAccessService } from "@core/services/controlAccess.service";
import { ITokenJwtData } from "@core/common/interfaces/ITokenJwtData";

@injectable()
export class ClientsWithCompaniesListerUseCase {
  constructor(
    private readonly clientService: ClientService,
    private readonly controlAccessService: ControlAccessService
  ) {}

  async execute(
    tokenJwtData: ITokenJwtData,
    permissionsRoute: Permissions[],
    query: ListClientRequest
  ): Promise<ListClienttGroupedByCompanyResponse | null> {
    const filterClientByPermission =
      await this.controlAccessService.filterClientByPermission(
        tokenJwtData,
        permissionsRoute
      );

    return this.clientService.listWithCompanies(
      filterClientByPermission,
      query
    );
  }
}
