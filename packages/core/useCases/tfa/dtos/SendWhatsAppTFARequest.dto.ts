import { ViewApiResponse } from "@core/useCases/api/dtos/ViewApiResponse.dto";
import { TFAType } from "@core/common/enums/TFAType";

export interface SendWhatsAppTFARequest {
  apiAccess: ViewApiResponse;
  type: TFAType;
  login: string;
}
