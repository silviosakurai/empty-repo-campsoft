import { ClientService } from "@core/services/client.service";
import { injectable } from "tsyringe";
import { PermissionsRoles } from "@core/common/enums/PermissionsRoles";
import { ViewClientRequest } from "@core/useCases/client/dtos/ViewClientRequest.dto";
import { ViewClientByIdResponse } from "./dtos/ViewClientByIdResponse.dto";
import { ITokenJwtData } from "@core/common/interfaces/ITokenJwtData";
import { ControlAccessService } from "@core/services/controlAccess.service";

@injectable()
export class ClientByIdViewerUseCase {
  constructor(
    private readonly clientService: ClientService,
    private readonly controlAccessService: ControlAccessService
  ) {}

  async execute(
    tokenJwtData: ITokenJwtData,
    permissionsRoute: PermissionsRoles[],
    userId: string
  ): Promise<ViewClientByIdResponse | null> {
    const filterClientByPermission =
      await this.controlAccessService.filterClientByPermission(
        tokenJwtData,
        permissionsRoute
      );

    return this.clientService.viewById(filterClientByPermission, userId);
  }
}
