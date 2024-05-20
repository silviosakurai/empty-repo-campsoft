import { injectable } from "tsyringe";
import { ListPlanRequest } from "./dtos/ListPlanRequest.dto";
import { ITokenJwtData } from "@core/common/interfaces/ITokenJwtData";
import { ControlAccessService } from "@core/services/controlAccess.service";
import { PlanService } from "@core/services/plan.service";

@injectable()
export class PlansListerByCompanyUseCase {
  constructor(
    private readonly planService: PlanService,
    private readonly controlAccessService: ControlAccessService
  ) {}

  async execute(
    tokenJwtData: ITokenJwtData,
    query: ListPlanRequest
  ): Promise<object | null> {
    const listPartnersIds =
      this.controlAccessService.listPartnersIds(tokenJwtData);

    return this.planService.listByCompany(listPartnersIds, query);
  }
}
