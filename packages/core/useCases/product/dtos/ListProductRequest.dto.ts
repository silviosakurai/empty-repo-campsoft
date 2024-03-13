import { SortOrder } from "@core/common/enums/SortOrder";
import { ProductFields, ProductStatus } from "@core/common/enums/models/product";

export interface ListProductRequest {
  id?: string;
  status?: ProductStatus;
  name?: string;
  description?: string;
  product_type?: string;
  slug?: string;
  sort_by?: ProductFields;
  sort_order?: SortOrder;
  per_page: number;
  current_page: number;
}
