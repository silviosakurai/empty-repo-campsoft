import { Type } from "@sinclair/typebox";
import { productDetailPlanProductsSchema } from "../product/productDetailPlanProductsSchema";
import { planDetailsWithProductsAvailableSchema } from "../plan/planDetailsWithProductsAvailableSchema";

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
  products: Type.Array(
    Type.Object({
      ...productDetailPlanProductsSchema.properties,
      created_at: Type.String({ format: "date-time" }),
      updated_at: Type.String({ format: "date-time" }),
    })
  ),
  plans: Type.Array(planDetailsWithProductsAvailableSchema),
});
