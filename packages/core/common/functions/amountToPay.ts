import { ListOrderById } from "@core/interfaces/repositories/order";
import { OrderStatusEnum } from "../enums/models/order";
import { ApiErrorCategoryZoop } from "../enums/ApiErrorCategoryZoop";

export function amountToPay(order: ListOrderById): number {
  let amountToPay =
    order.status_id !== OrderStatusEnum.APPROVED &&
    order.order_id_previous &&
    order.total_previous_order_discount_value
      ? +order.total_previous_order_discount_value
      : +order.total_price_with_discount;

  if (!amountToPay) {
    amountToPay = +order.total_price;
  }

  if (amountToPay <= 0) {
    throw new Error(ApiErrorCategoryZoop.AmountToPayInvalid);
  }

  return amountToPay * 100;
}
