import { TFAType } from "@core/common/enums/models/tfa";
import { ViewApiResponse } from "@core/useCases/api/dtos/ViewApiResponse.dto";

export interface SendWhatsAppTFARequest {
  apiAccess: ViewApiResponse;
  type: TFAType;
  login: string;
}
