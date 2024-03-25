import { SortOrder } from "@core/common/enums/SortOrder";
import { ProductFields } from "@core/common/enums/models/product";
import { IPaginationQueryString } from "@core/common/interfaces/IPaginationQueryString";

export interface CrossSellProductRequest extends IPaginationQueryString {
  client_id: string;
  plan_id: number;
  id?: string;
  name?: string;
  description?: string;
  product_type?: string;
  sort_by?: ProductFields;
  sort_order?: SortOrder;
}
