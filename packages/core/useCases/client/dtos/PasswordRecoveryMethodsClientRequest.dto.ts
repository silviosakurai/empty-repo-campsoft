import { ViewApiResponse } from "@core/useCases/api/dtos/ViewApiResponse.dto";

export interface PasswordRecoveryMethodsClientRequest {
  apiAccess: ViewApiResponse;
  login: string;
}
