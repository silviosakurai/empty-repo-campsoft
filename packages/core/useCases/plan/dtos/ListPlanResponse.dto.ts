import { Plan } from "@core/common/enums/models/plan";
import { Static } from "@sinclair/typebox";
import { planListResponseSchema } from "@core/schema/plan/planListResponseSchema";
import { planProductSchema } from "@core/schema/product/productViewSchema";

export interface ListPlanResult {
  results: Plan[];
}

export type ListPlanResponse = Static<typeof planListResponseSchema>;

export type ListPlanProductResponse = Static<typeof planProductSchema>;

export interface PlanListByProduct {
  plan_id: number;
  name: string;
  low_price: number;
}
