import { cancelOrderSchema } from "@core/schema/order/cancelOrderSchema";
import { Static } from "@sinclair/typebox";

export type CancelOrderResponse = Static<typeof cancelOrderSchema>;
