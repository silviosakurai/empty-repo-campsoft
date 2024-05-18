import { cartCreateRequestSchema } from "@core/validations/cart/cartCreateRequestSchema";
import { Static } from "@sinclair/typebox";

export type CreateCartRequest = Static<typeof cartCreateRequestSchema>;
