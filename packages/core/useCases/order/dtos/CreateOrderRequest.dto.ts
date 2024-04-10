import { OrderPaymentsMethodsEnum } from "@core/common/enums/models/order";

export interface Payment {
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
}

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
  payment: Payment | null;
}

export interface ViewOrderCreatedRequestDto {
  previous_order_id: string;
  activate_now: boolean;
  plan: {
    plan_id: number;
    selected_products: string[];
  };
  products: string[];
  months: number;
  subscribe: boolean;
  coupon_code: string;
  payment: {
    type: "boleto" | "pix" | "credit_card" | "voucher";
    credit_card?: {
      name: string;
      number: string;
      expire_month: number;
      expire_year: number;
      cvv: string;
      installments: number;
    };
    credit_card_id?: number;
    voucher?: string;
  };
}
export interface ViewOrderCreatedResponseDto {}
