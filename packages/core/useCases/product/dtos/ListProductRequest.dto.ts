import { SortOrder } from "@core/common/enums/SortOrder";
import { ProductFields, ProductStatus } from "@core/common/enums/models/product";

export interface ListProductRequest {
  id?: string;
  status?: ProductStatus;
  name?: string;
  description?: string;
  productType?: string;
  slug?: string;
  sortBy?: ProductFields;
  sortOrder?: SortOrder;
  limit: number;
  page: number;
}
