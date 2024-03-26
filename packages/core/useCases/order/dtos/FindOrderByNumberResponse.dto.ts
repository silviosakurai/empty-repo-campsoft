import {
  OrderPayments,
  PlanDetails,
  Prices,
  TotalsOrder,
} from "@core/interfaces/repositories/order";
import { ListOrderResponse } from "./ListOrderResponse.dto";
import {
  AvailableProducts,
  PlanProducts,
} from "@core/interfaces/repositories/voucher";

export interface FindOrderByNumberAvailableProducts extends AvailableProducts {
  selected_products: PlanProducts[];
}

export interface FindOrderByNumberPlans extends PlanDetails {
  prices: Prices[];
  plan_products: PlanProducts[];
  product_groups: FindOrderByNumberAvailableProducts[];
}

export type FindOrderByNumberResponse = {
  order_id: string;
  client_id: string;
  seller_id: string;
  status: string;
  totals: TotalsOrder & {
    installments: {
      installment: number | null;
      value: number | null;
    };
  };
  plans: FindOrderByNumberPlans[];
  payments: OrderPayments[];
  created_at: string;
  updated_at: string;
};
