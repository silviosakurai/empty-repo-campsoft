import { ViewApiResponse } from "@core/useCases/api/dtos/ViewApiResponse.dto";

export interface LoginRequest {
  apiAccess: ViewApiResponse;
  login: string;
  password: string;
}
