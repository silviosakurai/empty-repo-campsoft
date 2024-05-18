import { PlanPrice } from "@core/common/enums/models/plan";
import { CreateCartRequest } from "@core/useCases/cart/dtos/CreateCartRequest.dto";
import { ViewClientResponse } from "@core/useCases/client/dtos/ViewClientResponse.dto";
import { ISignatureActiveByClient } from "./signature";

export interface CartValidation {
  user: ViewClientResponse;
}

export interface CartDocument {
  cart_id: string;
  payload: CreateCartRequest;
  total_prices: PlanPrice;
  products_id: string[];
  signature_active: ISignatureActiveByClient[];
}
