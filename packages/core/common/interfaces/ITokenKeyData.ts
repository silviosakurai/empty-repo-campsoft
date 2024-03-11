import { ApiStatus } from "@core/common/enums/models/api";

export interface ITokenKeyData {
  api_key: string;
  api_access_id: number;
  name: string;
  status: ApiStatus;
  company_id: number;
}
