import { Type } from "@sinclair/typebox";
import { productDetailHowToAccessWithDatesSchema } from "../product/productDetailHowToAccessWithDatesSchema";

export const cancelOrderSchema = Type.Object({
  status: Type.String(),
  products: Type.Array(productDetailHowToAccessWithDatesSchema),
});
