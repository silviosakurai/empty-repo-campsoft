import { Type } from "@sinclair/typebox";
import { productDetailsWithPricesAndDatesSchema } from "../product/productDetailsWithPricesAndDatesSchema";
import { planDetailsWithProductsSelectedSchema } from "../plan/planDetailsWithProductsSelectedSchema";

export const cartCreatorResponseSchema = Type.Object({
  totals: Type.Array(
    Type.Object({
      subtotal_price: Type.Number(),
      discount_item_value: Type.Number(),
      discount_coupon_value: Type.Number(),
      discount_products_value: Type.Number(),
      discount_percentage: Type.Number(),
      total: Type.Number(),
      installments: Type.Array(
        Type.Object({
          installment: Type.Number(),
          value: Type.Number(),
        })
      ),
    })
  ),
  products: Type.Array(productDetailsWithPricesAndDatesSchema),
  plans: Type.Array(planDetailsWithProductsSelectedSchema),
});
