import { ProductResponse } from "@core/useCases/product/dtos/ProductResponse.dto";
import { Status } from "../Status";

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


export type Plan = {
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
  prices: PlanPrice[];
  products: ProductResponse[];
  product_groups: ProductsGroups[];
};
