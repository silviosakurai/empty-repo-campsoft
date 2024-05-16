import { Language } from "@core/common/enums/Language";
import { PlanFields } from "@core/common/enums/models/plan";
import { SortOrder } from "@core/common/enums/SortOrder";
import { Status } from "@core/common/enums/Status";
import { TagSwagger } from "@core/common/enums/TagSwagger";
import { planDetailsWithProductsAvailableSchema } from "@core/schema/plan/planDetailsWithProductsAvailableSchema";
import { Type } from "@sinclair/typebox";

export const listPlanByCompanySchema = {
  description: "Seleciona todos os planos",
  tags: [TagSwagger.plan],
  produces: ["application/json"],
  security: [
    {
      authenticateJwt: [],
    },
  ],
  headers: Type.Object({
    "Accept-Language": Type.Optional(
      Type.String({
        description: "Idioma preferencial para a resposta",
        enum: Object.values(Language),
        default: Language.pt,
      })
    ),
  }),
  querystring: Type.Object({
    id: Type.Optional(Type.String()),
    status: Type.Optional(
      Type.String({
        enum: Object.values(Status),
        default: Status.ACTIVE,
      })
    ),
    plan: Type.Optional(Type.String()),
    description: Type.Optional(Type.String()),
    sort_by: Type.Optional(
      Type.String({
        enum: Object.values(PlanFields),
        default: PlanFields.plan_id,
      })
    ),
    sort_order: Type.Optional(
      Type.String({ enum: Object.values(SortOrder), default: SortOrder.DESC })
    ),
  }),
  response: {
    200: Type.Object(
      {
        status: Type.Boolean(),
        message: Type.String(),
        data: Type.Array(planDetailsWithProductsAvailableSchema),
      },
      { description: "Successful" }
    ),
    401: Type.Object(
      {
        status: Type.Boolean({ default: false }),
        message: Type.String(),
        data: Type.Null(),
      },
      { description: "Unauthorized" }
    ),
    404: Type.Object(
      {
        status: Type.Boolean({ default: false }),
        message: Type.String(),
        data: Type.Null(),
      },
      { description: "Not Found" }
    ),
    500: Type.Object(
      {
        status: Type.Boolean({ default: false }),
        message: Type.String(),
        data: Type.Null(),
      },
      { description: "Internal Server Error" }
    ),
  },
};
