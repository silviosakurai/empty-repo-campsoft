import { Plan } from "@core/common/enums/models/plan";
import { Static } from "@sinclair/typebox";
import { planListResponseSchema } from "@core/schema/plan/planListResponseSchema";

export interface ListPlanResult {
  results: Plan[];
}

export type ListPlanResponse = Static<typeof planListResponseSchema>;
