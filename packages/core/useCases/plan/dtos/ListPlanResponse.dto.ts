import { Plan } from "@core/common/enums/models/plan";
import { Static } from "@sinclair/typebox";
import { planProductSchema } from "@core/schema/product/productViewSchema";
import { planDetailsWithProductsAvailableSchema } from "@core/schema/plan/planDetailsWithProductsAvailableSchema";

export interface ListPlanResult {
  results: Plan[];
}

export type ListPlanResponse = Static<
  typeof planDetailsWithProductsAvailableSchema
>;

export type ListPlanProductResponse = Static<typeof planProductSchema>;

export interface PlanListByProduct {
  plan_id: number;
  name: string;
  low_price: number;
}
