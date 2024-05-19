import {
  orderCreateRequestSchema,
  orderPaymentSchema,
} from "@core/schema/order/orderCreateRequestSchema";
import { Static } from "@sinclair/typebox";

export type CreateOrderRequestDto = Static<typeof orderCreateRequestSchema>;
export type Payment = Static<typeof orderPaymentSchema>;

export interface VoucherOrderRequestDto {
  voucher: string;
}
