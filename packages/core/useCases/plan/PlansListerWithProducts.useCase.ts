import { PlanService } from "@core/services";
import { injectable } from "tsyringe";
import { ListPlanRequest } from "./dtos/ListPlanRequest.dto";
import { FastifyRedis } from "@fastify/redis";
import { PermissionsRoles } from "@core/common/enums/PermissionsRoles";
import { ITokenJwtData } from "@core/common/interfaces/ITokenJwtData";
import { ControlAccessService } from "@core/services/controlAccess.service";

@injectable()
export class PlansListerWithProductsUseCase {
  constructor(
    private readonly planService: PlanService,
    private readonly controlAccessService: ControlAccessService
  ) {}

  async execute(
    tokenJwtData: ITokenJwtData,
    permissionsRoute: PermissionsRoles[],
    query: ListPlanRequest,
    redis: FastifyRedis
  ): Promise<object | null> {
    const filterClientByPermission =
      await this.controlAccessService.filterClientByPermission(
        tokenJwtData,
        permissionsRoute,
        redis
      );

    return this.planService.listWithProducts(filterClientByPermission, query);
  }
}
