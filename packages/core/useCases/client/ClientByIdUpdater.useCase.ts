import { ClientService } from "@core/services/client.service";
import { injectable } from "tsyringe";
import { UpdateClientByIdRequestDto } from "./dtos/updateClientByIdRequest.dto";
import { ITokenJwtData } from "@core/common/interfaces/ITokenJwtData";
import { PermissionsRoles } from "@core/common/enums/PermissionsRoles";
import { FastifyRedis } from "@fastify/redis";
import { ControlAccessService } from "@core/services/controlAccess.service";

@injectable()
export class ClientByIdUpdaterUseCase {
  constructor(
    private readonly clientService: ClientService,
    private readonly controlAccessService: ControlAccessService
  ) {}

  async update(
    tokenJwtData: ITokenJwtData,
    permissionsRoute: PermissionsRoles[],
    userId: string,
    redis: FastifyRedis,
    input: UpdateClientByIdRequestDto
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

    const userUpdated = await this.clientService.updateById(userId, input);

    if (!userUpdated) {
      return null;
    }

    return userUpdated;
  }
}
