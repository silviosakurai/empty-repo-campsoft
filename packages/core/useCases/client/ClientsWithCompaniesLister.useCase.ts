import {
  ListClientGroupedByCompany,
  ListClienttGroupedByCompanyResponse,
} from "@core/useCases/client/dtos/ListClientResponse.dto";
import { ListClientRequest } from "@core/useCases/client/dtos/ListClientRequest.dto";
import { injectable } from "tsyringe";
import { PermissionsRoles } from "@core/common/enums/PermissionsRoles";
import { ControlAccessService } from "@core/services/controlAccess.service";
import { ITokenJwtData } from "@core/common/interfaces/ITokenJwtData";
import { setPaginationData } from "@core/common/functions/createPaginationData";
import { FastifyRedis } from "@fastify/redis";
import { ClientService } from "@core/services/client.service";

@injectable()
export class ClientsWithCompaniesListerUseCase {
  constructor(
    private readonly clientService: ClientService,
    private readonly controlAccessService: ControlAccessService
  ) {}

  async execute(
    tokenJwtData: ITokenJwtData,
    permissionsRoute: PermissionsRoles[],
    query: ListClientRequest,
    redis: FastifyRedis
  ): Promise<ListClienttGroupedByCompanyResponse | null> {
    const filterClientByPermission =
      await this.controlAccessService.filterClientByPermission(
        tokenJwtData,
        permissionsRoute,
        redis
      );

    const [listClientCompanies, total] = await Promise.all([
      this.clientService.listWithCompanies(filterClientByPermission, query),
      this.clientService.countTotalClientWithCompanies(
        filterClientByPermission,
        query
      ),
    ]);

    if (!listClientCompanies?.length) {
      return this.emptyResult(query);
    }

    const paging = setPaginationData(
      listClientCompanies.length,
      total,
      query.per_page,
      query.current_page
    );

    return {
      paging,
      results: listClientCompanies as ListClientGroupedByCompany[],
    };
  }

  private emptyResult(input: ListClientRequest) {
    const paging = setPaginationData(0, 0, input.per_page, input.current_page);

    return {
      paging,
      results: [],
    };
  }
}
