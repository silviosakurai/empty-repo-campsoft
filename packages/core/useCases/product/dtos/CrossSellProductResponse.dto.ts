import { PlanPrice } from "@core/common/enums/models/plan";
import { ProductResponse } from "./ProductResponse.dto";
import { IPaginationResponse } from "@core/common/interfaces/IPaginationResponse";

export interface CrossSellProductResult extends ProductResponse {
  prices: PlanPrice[];
}

export type CrossSellProductResponse = IPaginationResponse &
  CrossSellProductResult;
