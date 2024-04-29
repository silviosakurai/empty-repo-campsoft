import { ProductGroupImageType } from "@core/common/enums/models/product";

export interface CreateProductGroupImageParamsRequest {
  groupId: number;
  type: ProductGroupImageType;
}

export interface CreateProductGroupImageBodyRequest {
  image: string;
}
