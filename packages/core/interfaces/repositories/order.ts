import { Status } from "@core/common/enums/Status";
import { orderPaymentsSchema } from "@core/schema/order/orderPaymentsSchema";
import { FindOrderByNumberPlans } from "@core/useCases/order/dtos/FindOrderByNumberResponse.dto";
import { Static } from "@sinclair/typebox";

export interface ListOrder {
  order_id: string;
  client_id: string;
  seller_id: string;
  status: string;
}

export interface PlanDetails {
  plan_id: number;
  status: Status | null;
  visible_site: boolean;
  business_id: number | null;
  plan: string | null;
  image: string | null;
  description: string | null;
  short_description: string | null;
}

export interface Prices {
  price: number | null;
  discount_value: number | null;
  discount_percentage: number | null;
  price_with_discount: number | null;
}

export interface TotalsOrder {
  subtotal_price: number;
  discount_item_value: number;
  discount_coupon_value: number;
  discount_percentage: number;
  discount_product_value: number | null;
  total: number;
}

export interface Installments {
  installment: number | null;
  value: number | null;
}

interface CreditCard {
  brand: string;
  number: string;
  credit_card_id: string;
}

interface Boleto {
  url: string;
  code: string;
}

interface Pix {
  url: string;
  code: string;
  expire_at: string;
}

export interface OrderByNumberResponse {
  order_id: string;
  client_id: string;
  seller_id: string;
  status: string;
  totals: TotalsOrder;
  installments: Installments;
  payments: OrderPayments[];
  plan: FindOrderByNumberPlans | null;
  created_at: string;
  updated_at: string;
}

export interface OrderCreatePaymentsCard {
  installments: number;
  value: number;
}

export interface CreateOrder {
  order_id: string;
  order_id_previous: string | null;
  active_now: boolean;
}

export interface ListOrderById {
  order_id: string;
  order_id_previous: string;
  client_id: string;
  company_id: number;
  status_id: number;
  recurrence: number;
  recurrence_period: number;
  total_price: number;
  total_discount: number;
  total_price_with_discount: number;
  total_previous_order_discount_value: number;
  total_installments: number;
  total_installments_value: number;
  activation_immediate: boolean;
}

export type OrderPayments = Static<typeof orderPaymentsSchema>;