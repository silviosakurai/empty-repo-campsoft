import { ViewClientResponse } from "@core/useCases/client/dtos/ViewClientResponse.dto";
import { Static } from "@sinclair/typebox";
import {
  cartListManagerResponseSchema,
  cartListResponseSchema,
} from "@core/schema/cart/cartListResponseSchema";

export interface CartValidation {
  user: ViewClientResponse;
}

export type CartDocument = Static<typeof cartListResponseSchema>;
export type CartDocumentManager = Static<typeof cartListManagerResponseSchema>;
