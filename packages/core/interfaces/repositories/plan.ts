import { Status } from "@core/common/enums/Status";
import { Plan, PlanItem, PlanVisivelSite } from "@core/common/enums/models/plan";

export interface ViewPlanRepositoryDTO {
  plan_id: number;
  status: Status | null;
  visible_site: PlanVisivelSite | null;
  business_id: number | null;
  plan: string | null;
  image: string | null;
  description: string | null;
  short_description: string | null;
  created_at: string;
  updated_at: string;
}

export interface UpgradePlanRepositoryDTO {
  client_id: unknown;
  client_signature_id: unknown;
  status: number;
  plan_id: number;
}

export interface UpgradePlanRepositoryResponse {
  plans: Plan[];
  planItems: PlanItem[];
}
