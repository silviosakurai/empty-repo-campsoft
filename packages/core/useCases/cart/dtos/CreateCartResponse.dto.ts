import { Plan } from "@core/common/enums/models/plan";
import { planDetailsWithProductsSelectedSchema } from "@core/schema/plan/planDetailsWithProductsSelectedSchema";
import { ProductResponse } from "@core/useCases/product/dtos/ProductResponse.dto";
import { Static } from "@sinclair/typebox";

export interface CreateCartResponse {
  id: string;
  products: ProductResponse[];
  plans: Plan[] | null;
  totals: CartOrder[];
}

export interface CartOrder {
  subtotal_price: number;
  discount_item_value: number;
  discount_coupon_value: number;
  discount_products_value: number;
  discount_percentage: number;
  total: number;
  installments: Installment[];
}

interface Installment {
  installment: number;
  value: number;
}

export type PlanDetailsWithSelectedProducts = Static<
  typeof planDetailsWithProductsSelectedSchema
>;
