import { SortOrder } from "@core/common/enums/SortOrder";
import { IPaginationQueryString } from "@core/common/interfaces/IPaginationQueryString";

export interface CrossSellProductRequest extends IPaginationQueryString {
  client_id: string;
  plan_id: string;
  id?: string;
  name?: string;
  description?: string;
  product_type?: string;
  sort_order?: SortOrder;
}
