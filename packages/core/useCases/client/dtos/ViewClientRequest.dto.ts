import { ViewApiResponse } from "@core/useCases/api/dtos/ViewApiResponse.dto";

export interface ViewClientRequest {
  apiAccess: ViewApiResponse;
  userId: string;
}
