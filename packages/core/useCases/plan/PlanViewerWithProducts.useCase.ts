import { PlanService } from "@core/services";
import { injectable } from "tsyringe";
import { Plan } from "@core/common/enums/models/plan";
import { ControlAccessService } from "@core/services/controlAccess.service";
import { FastifyRedis } from "@fastify/redis";
import { PermissionsRoles } from "@core/common/enums/PermissionsRoles";
import { ITokenJwtData } from "@core/common/interfaces/ITokenJwtData";

@injectable()
export class PlanViewerWithProductsUseCase {
  constructor(
    private readonly planService: PlanService,
    private readonly controlAccessService: ControlAccessService
  ) {}

  async execute(
    tokenJwtData: ITokenJwtData,
    permissionsRoute: PermissionsRoles[],
    planId: number,
    redis: FastifyRedis
  ): Promise<Plan | null> {
    const partnersId =
      await this.controlAccessService.listPartnersIds(tokenJwtData);

    return this.planService.viewWithProducts(partnersId, planId);
  }
}
