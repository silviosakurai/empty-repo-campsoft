import { planCreateSchema } from "@core/schema/plan/planCreateSchema";
import { Static } from "@sinclair/typebox";

export type CreatePlanRequest = Static<typeof planCreateSchema>;
