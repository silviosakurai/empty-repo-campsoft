import { Type } from "@sinclair/typebox";
import { productDetailSchema } from "../product/productDetailSchema";
import { planDetailsWithProductsSchema } from "../plan/planDetailsWithProductsSchema";
import { voucherDetailsSchema } from "../voucher/voucherDetailsSchema";

export const userVoucherResponseSchema = Type.Object({
  voucher: voucherDetailsSchema,
  products: Type.Array(productDetailSchema),
  plan: planDetailsWithProductsSchema,
});
