import { PermissionsRoles } from "@core/common/enums/PermissionsRoles";
import { ITokenJwtData } from "@core/common/interfaces/ITokenJwtData";
import { ClientService } from "@core/services/client.service";
import { ControlAccessService } from "@core/services/controlAccess.service";
import { FastifyRedis } from "@fastify/redis";
import { injectable } from "tsyringe";

@injectable()
export class ClientByIdEraserUseCase {
  constructor(
    private readonly clientService: ClientService,
    private readonly controlAccessService: ControlAccessService
  ) {}

  async delete(
    tokenJwtData: ITokenJwtData,
    permissionsRoute: PermissionsRoles[],
    userId: string,
    redis: FastifyRedis
  ): Promise<boolean | null> {
    const filterClientByPermission =
      await this.controlAccessService.filterClientByPermission(
        tokenJwtData,
        permissionsRoute,
        redis
      );
    const userFounded = await this.clientService.viewById(
      filterClientByPermission,
      userId
    );

    if (!userFounded) {
      return null;
    }

    const userDelete = await this.clientService.deleteById(userId, userFounded);

    if (!userDelete) {
      return null;
    }

    return userDelete;
  }
}
