import Schema from "fluent-json-schema";
import { Status } from "@core/common/enums/Status";
import { SortOrder } from "@core/common/enums/SortOrder";
import { PlanFieldsToOrder } from "@core/common/enums/models/plan";

const listPlanSchema = {
  querystring: Schema.object()
    .prop("id", Schema.string())
    .prop("status", Schema.string().enum(Object.values(Status)).default(Status.ACTIVE))
    .prop("plan", Schema.string())
    .prop("description", Schema.string())
    .prop("sort_by", Schema.string().enum(Object.keys(PlanFieldsToOrder)))
    .prop("sort_order", Schema.string().enum(Object.values(SortOrder)))
    .prop("per_page", Schema.number().default(10))
    .prop("current_page", Schema.number().default(1))
};

const getPlan = {
  params: Schema.object().prop("plan_id", Schema.string().required()),
};

export {
  listPlanSchema,
  getPlan,
};
