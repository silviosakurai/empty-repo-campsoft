import {
  orderCreateRequestSchema,
  orderPaymentSchema,
} from "@core/schema/order/orderCreateRequestSchema";
import { Static } from "@sinclair/typebox";

export type CreateOrderByManagerRequestDto = Static<typeof orderCreateRequestSchema> & { client_id: string };
export type Payment = Static<typeof orderPaymentSchema>;
