import { TFAType } from "@core/common/enums/models/tfa";
import { LoginUserTFA } from "@core/interfaces/services/IClient.service";
import { ViewApiResponse } from "@core/useCases/api/dtos/ViewApiResponse.dto";

export interface SendCodeTFARequest {
  apiAccess: ViewApiResponse;
  type: TFAType;
  login: string;
}

export interface SendCodeLoginTFARequest {
  apiAccess: ViewApiResponse;
  type: TFAType;
  loginUserTFA: LoginUserTFA;
}
