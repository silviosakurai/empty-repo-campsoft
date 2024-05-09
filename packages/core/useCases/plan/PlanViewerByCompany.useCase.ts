import { PlanService } from "@core/services";
import { injectable } from "tsyringe";
import { Plan } from "@core/common/enums/models/plan";
import { ControlAccessService } from "@core/services/controlAccess.service";
import { ITokenJwtData } from "@core/common/interfaces/ITokenJwtData";

@injectable()
export class PlanViewerByCompanyUseCase {
  constructor(
    private readonly planService: PlanService,
    private readonly controlAccessService: ControlAccessService,
  ) {}

  async execute(
    tokenJwtData: ITokenJwtData,
    planId: number,
  ): Promise<Plan | null> {
    const listPartnersIds =
      this.controlAccessService.listPartnersIds(tokenJwtData);

    return this.planService.viewByCompany(listPartnersIds, planId);
  }
}
