import { ViewClientResponse } from "@core/useCases/client/dtos/ViewClientResponse.dto";
import { Static } from "@sinclair/typebox";
import { cartListResponseSchema } from "@core/schema/cart/cartListResponseSchema";

export interface CartValidation {
  user: ViewClientResponse;
}

export type CartDocument = Static<typeof cartListResponseSchema>;
