import { cartCreateRequestSchema } from "@core/schema/cart/cartCreateRequestSchema";
import { Static } from "@sinclair/typebox";

export type CreateCartRequest = Static<typeof cartCreateRequestSchema>;
