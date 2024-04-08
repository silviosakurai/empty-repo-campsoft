import { Status } from "@core/common/enums/Status";
import { SortOrder } from "@core/common/enums/SortOrder";
import { PlanFields } from "@core/common/enums/models/plan";

export interface ListPlanRequest {
  id?: number;
  status?: Status;
  plan?: string;
  description?: string;
  sort_by?: PlanFields;
  sort_order?: SortOrder;
  per_page: number;
  current_page: number;
}
