import { Status } from "@core/common/enums/Status";
import { Plan, PlanItem } from "@core/common/enums/models/plan";

export interface ViewPlanRepositoryDTO {
  plan_id: number;
  status: Status | null;
  visible_site: boolean;
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

export interface PlanProduct {
  plan_id: number;
  product_id: number;
}

export interface PlanPriceOrder {
  id_produt: number;
  plan_percentage: number;
}

export interface PlanPriceCrossSellOrder {
  product_id: string | null;
  price_discount: number;
  discount_coupon?: number | null;
  discount_product?: number | null;
}

export interface PlanListerOrderResponse {
  product_id: string;
}
