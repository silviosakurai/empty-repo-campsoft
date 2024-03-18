import { IPaginationResponse } from "@core/common/interfaces/IPaginationResponse";
import { Plan } from "@core/common/enums/models/plan";

export interface ListPlanResult {
  results: Plan[];
}

export type ListPlanResponse = IPaginationResponse & ListPlanResult;