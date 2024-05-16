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
import { orderListResponseSchema } from "@core/schema/order/orderListResponseSchema";
import { Static } from "@sinclair/typebox";

export interface AvailableProductsWithProducts extends AvailableProducts {
  selected_products: ProductDetail[];
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
  plan: PlanDetailsWithProducts;
  created_at: string;
  updated_at: string;
}

export type ListOrderResponseDto = Static<typeof orderListResponseSchema>;

export type ListOrderWithCurrenceResponse = {
  order_id: string;
  client_id: string;
  seller_id: string;
  status: string;
  totals: TotalsOrder;
  installments: Installments;
  payments: OrderPayments[];
  products: ProductDetail[];
  plan: PlanDetailsWithProducts;
  validity: string;
  origin: string;
  recurrence: string;
  price: number;
  created_at: string;
  updated_at: string;
};
