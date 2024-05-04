import { SortOrder } from "@core/common/enums/SortOrder";
import { Status } from "@core/common/enums/Status";
import { ProductOrderManager } from "@core/common/enums/models/product";

export interface ListProductByCompanyRequest {
  id?: string;
  company_id?: number[];
  status?: Status;
  name?: string;
  description?: string;
  product_type_id?: number;
  slug?: string;
  sort_by?: ProductOrderManager;
  sort_order?: SortOrder;
  per_page: number;
  current_page: number;
}
