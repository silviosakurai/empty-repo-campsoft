import { PermissionsRoles } from "@core/common/enums/PermissionsRoles";
import { ITokenJwtData } from "@core/common/interfaces/ITokenJwtData";
import { AuthService } from "@core/services/auth.service";
import { ClientService } from "@core/services/client.service";
import { ControlAccessService } from "@core/services/controlAccess.service";
import { FastifyRedis } from "@fastify/redis";
import { injectable } from "tsyringe";

@injectable()
export class ClientSendSsoUseCase {
  constructor(
    private readonly authService: AuthService,
    private readonly clientService: ClientService,
    private readonly controlAccessService: ControlAccessService
  ) {}

  async send(
    tokenJwtData: ITokenJwtData,
    permissionsRoute: PermissionsRoles[],
    userId: string,
    redis: FastifyRedis
  ): Promise<string | null> {
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

    const generateToken = await this.authService.generateAndVerifyMagicToken();

    if (generateToken) {
      const createMagicToken = await this.authService.createMagicToken(
        userId,
        generateToken
      );

      if (!createMagicToken) return null;

      return generateToken;
    }

    return null;
  }
}
