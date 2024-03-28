import { ProductResponse } from "./ProductResponse.dto";
import { IPaginationResponse } from "@core/common/interfaces/IPaginationResponse";

export type CrossSellProductResponse = IPaginationResponse & ProductResponse;
