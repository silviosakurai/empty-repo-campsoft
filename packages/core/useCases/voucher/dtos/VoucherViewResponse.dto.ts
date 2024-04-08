import {
  AvailableProducts,
  PlanDetails,
  PlanProducts,
  ProductDetail,
} from "@core/interfaces/repositories/voucher";
import { userVoucherResponseSchema } from "@core/schema/user/userVoucherResponseSchema";
import { Static } from "@sinclair/typebox";

export interface AvailableProductsWithProducts extends AvailableProducts {
  available_products: ProductDetail[];
}

export interface PlanDetailsWithProducts extends PlanDetails {
  plan_products: PlanProducts[];
  product_groups: AvailableProductsWithProducts[];
}

export type VoucherViewRequestDto = Static<typeof userVoucherResponseSchema>;
