import { ClientService } from "@core/services/client.service";
import { injectable } from "tsyringe";
import { PermissionsRoles } from "@core/common/enums/PermissionsRoles";
import { ViewClientByIdResponse } from "./dtos/ViewClientByIdResponse.dto";
import { ITokenJwtData } from "@core/common/interfaces/ITokenJwtData";
import { ControlAccessService } from "@core/services/controlAccess.service";
import { FastifyRedis } from "@fastify/redis";

@injectable()
export class ClientByIdViewerUseCase {
  constructor(
    private readonly clientService: ClientService,
    private readonly controlAccessService: ControlAccessService
  ) {}

  async execute(
    tokenJwtData: ITokenJwtData,
    permissionsRoute: PermissionsRoles[],
    userId: string,
    redis: FastifyRedis
  ): Promise<ViewClientByIdResponse | null> {
    const filterClientByPermission =
      await this.controlAccessService.filterClientByPermission(
        tokenJwtData,
        permissionsRoute,
        redis
      );

    return this.clientService.viewById(filterClientByPermission, userId);
  }
}
