import {
  Installments,
  OrderPayments,
  PlanDetails,
  Prices,
  TotalsOrder,
} from "@core/interfaces/repositories/order";
import {
  AvailableProducts,
  PlanProducts,
  ProductDetail,
} from "@core/interfaces/repositories/voucher";

export interface AvailableProductsWithProducts extends AvailableProducts {
  available_products: ProductDetail[];
}

export interface PlanDetailsWithProducts extends PlanDetails {
  prices: Prices[];
  plan_products: PlanProducts[];
  product_groups: AvailableProductsWithProducts[];
}

export interface ListOrderResponse {
  order_id: string;
  client_id: string;
  seller_id: string;
  status: string;
  totals: TotalsOrder;
  installments: Installments;
  payments: OrderPayments[];
  products: ProductDetail[];
  plans: PlanDetailsWithProducts[];
  created_at: string;
  updated_at: string;
}

export interface ListOrderResponseDto {
  results: ListOrderResponse[];
}
