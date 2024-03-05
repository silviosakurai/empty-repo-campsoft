import { ApiStatus } from "@core/common/enums/models/api";

export interface ViewApiResponse {
  api_access: string;
  name: string;
  status: ApiStatus;
  company: string;
}
