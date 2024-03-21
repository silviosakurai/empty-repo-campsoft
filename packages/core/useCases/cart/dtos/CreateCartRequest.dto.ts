export interface CreateCartRequest {
  discount_coupon: number;
  months: number;
  plans_id: number[] | null;
  products_id: string[] | null;
}
