import { ViewClientResponse } from "@core/useCases/client/dtos/ViewClientResponse.dto";
import { Static } from "@sinclair/typebox";
import {
  cartListManagerResponseSchema,
  cartListResponseSchema,
  cartListSchema,
  productViewerCartSchema,
} from "@core/schema/cart/cartListResponseSchema";

export interface CartValidation {
  user: ViewClientResponse;
}

export type CartDocument = Static<typeof cartListSchema>;
export type CartDocumentResponse = Static<typeof cartListResponseSchema>;
export type CartDocumentManager = Static<typeof cartListManagerResponseSchema>;
export type ProductViewerCart = Static<typeof productViewerCartSchema>;
