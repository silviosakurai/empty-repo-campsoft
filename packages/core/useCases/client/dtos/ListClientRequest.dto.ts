import { SortOrder } from "@core/common/enums/SortOrder";
import { ClientFields } from "@core/common/enums/models/client";

export interface ListClientRequest {
  name?: string;
  cpf?: string;
  email?: string;
  sort_by?: ClientFields;
  sort_order?: SortOrder;
  per_page: number;
  current_page: number;
}
