import { PlanDetails, Prices } from "@core/interfaces/repositories/order";
import {
  AvailableProducts,
  PlanProducts,
} from "@core/interfaces/repositories/voucher";
import { Static } from "@sinclair/typebox";
import { orderListSchema } from "@core/schema/order/orderListSchema";

export interface FindOrderByNumberAvailableProducts extends AvailableProducts {
  selected_products: PlanProducts[];
}

export interface FindOrderByNumberPlans extends PlanDetails {
  prices: Prices[];
  plan_products: PlanProducts[];
  product_groups: FindOrderByNumberAvailableProducts[];
}

export type FindOrderByNumberResponse = Static<typeof orderListSchema>;
