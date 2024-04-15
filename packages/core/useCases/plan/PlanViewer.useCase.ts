import { PlanService } from "@core/services";
import { injectable } from "tsyringe";
import { Plan } from "@core/common/enums/models/plan";
import { ITokenJwtData } from "@core/common/interfaces/ITokenJwtData";
import { AccessType } from "@core/common/enums/models/access";
import { checkIfCompanyHasAccess } from "@core/common/functions/checkIfCompanyHasAccess";

@injectable()
export class PlanViewerUseCase {
  constructor(private readonly planService: PlanService) {}

  async execute(
    tokenJwtData: ITokenJwtData,
    planId: number
  ): Promise<Plan | null> {
    const companyIdsAllowed = checkIfCompanyHasAccess(tokenJwtData.access, AccessType.PRODUCT_MANAGEMENT)

    return this.planService.viewByCompany(companyIdsAllowed, planId);
  }
}
