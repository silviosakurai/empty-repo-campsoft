import { SortOrder } from "@core/common/enums/SortOrder";
import { ClientFields, ClientStatus } from "@core/common/enums/models/client";

export interface ListClientRequest {
  status?: ClientStatus;
  name?: string;
  cpf?: string;
  email?: string;
  position_id?: number;
  company_id?: number;
  sort_by?: ClientFields;
  sort_order?: SortOrder;
  per_page: number;
  current_page: number;
}
