import { cartListRequestSchema } from "@core/validations/cart/cartListRequestSchema.validation";
import { Static } from "@sinclair/typebox";

export type ListCartRequest = Static<typeof cartListRequestSchema>;
