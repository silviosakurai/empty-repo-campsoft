import { OrderPaymentsMethodsEnum } from "@core/common/enums/models/order";

export interface CreateOrderRequestDto {
  previous_order_id: string | null;
  activate_now: boolean;
  plan: {
    plan_id: number;
    selected_products: string[] | null;
  };
  products: string[] | null;
  months: number;
  subscribe: boolean | null;
  coupon_code: string | null;
  payment: {
    type: OrderPaymentsMethodsEnum;
    credit_card: {
      name: string;
      number: string;
      expire_month: number;
      expire_year: number;
      cvv: string;
      installments: number;
    } | null;
    credit_card_id: string | null;
    voucher: string | null;
  } | null;
}
