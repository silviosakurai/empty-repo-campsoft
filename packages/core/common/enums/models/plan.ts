import { ProductResponse } from "@core/useCases/product/dtos/ProductResponse.dto";
import { planDetailsWithProductsAvailableSchema } from "@core/schema/plan/planDetailsWithProductsAvailableSchema";
import { Static } from "@sinclair/typebox";

export enum PlanVisivelSite {
  YES = "Y",
  NO = "N",
}

export enum PlanFields {
  plan_id = "plan_id",
  plan = "plan",
}

export enum PlanFieldsPT {
  id_plano = "id_plano",
  plano = "plano",
}

export const PlanFieldsToOrder = {
  [PlanFields.plan_id]: PlanFieldsPT.id_plano,
  [PlanFields.plan]: PlanFieldsPT.plano,
};

export type PlanPrice = {
  months: number;
  price: number | null;
  discount_value: number | null;
  discount_percentage: number | null;
  price_with_discount: number | null;
  price_with_discount_order_previous?: number | null;
  discount_coupon?: number | null;
  discount_product?: number | null;
};

export type PlanItem = {
  plan_id: number;
  product_id: string | null;
  discountPercent: number | null;
};

export type ProductsGroups = {
  product_group_id: number;
  name: string | null;
  quantity: number;
  available_products: ProductResponse[];
};

export type GroupProductGroupMapper = {
  [key: number]: ProductsGroups;
};

export type Plan = Static<typeof planDetailsWithProductsAvailableSchema>;
