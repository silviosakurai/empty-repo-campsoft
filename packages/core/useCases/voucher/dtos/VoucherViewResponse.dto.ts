import {
  AvailableProducts,
  PlanDetails,
  PlanProducts,
  ProductDetail,
} from "@core/interfaces/repositories/voucher";

export interface AvailableProductsWithProducts extends AvailableProducts {
  available_products: ProductDetail[];
}

export interface PlanDetailsWithProducts extends PlanDetails {
  plan_products: PlanProducts[];
  product_groups: AvailableProductsWithProducts[];
}

export interface VoucherViewRequestDto {
  products: ProductDetail[];
  plans: PlanDetailsWithProducts[];
}
