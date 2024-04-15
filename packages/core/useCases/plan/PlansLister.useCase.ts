import { PlanService } from "@core/services";
import { injectable } from "tsyringe";
import { ListPlanRequest } from "./dtos/ListPlanRequest.dto";
import { ITokenJwtData } from "@core/common/interfaces/ITokenJwtData";
import { AccessType } from "@core/common/enums/models/access";
import { checkIfCompanyHasAccess } from "@core/common/functions/checkIfCompanyHasAccess";

@injectable()
export class PlansListerUseCase {
  constructor(private readonly planService: PlanService) {}

  async execute(
    tokenJwtData: ITokenJwtData,
    query: ListPlanRequest
  ): Promise<object | null> {
    const companyIdsAllowed = checkIfCompanyHasAccess(tokenJwtData.access, AccessType.PRODUCT_MANAGEMENT)

    return this.planService.listByCompany(companyIdsAllowed, query);
  }
}
