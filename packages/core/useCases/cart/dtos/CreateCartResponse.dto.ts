import { Plan } from "@core/common/enums/models/plan";
import { ProductResponse } from "@core/useCases/product/dtos/ProductResponse.dto";

export interface CreateCartResponse {
  id: string;
  products: ProductResponse[];
  plans: Plan[] | null;
  totals: CartOrder[];
}

export interface CartOrder {
  subtotal_price: number;
  discount_item_value: number;
  discount_coupon_value: number;
  discount_products_value: number;
  discount_percentage: number;
  total: number;
  installments: Installment[];
}

interface Installment {
  installment: number;
  value: number;
}
