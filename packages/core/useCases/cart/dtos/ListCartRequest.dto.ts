import { cartListRequestSchema } from "@core/schema/cart/cartListRequestSchema";
import { Static } from "@sinclair/typebox";

export type ListCartRequest = Static<typeof cartListRequestSchema>;
