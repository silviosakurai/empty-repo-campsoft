import { TFAType } from "@core/common/enums/models/tfa";
import { ITokenKeyData } from "@core/common/interfaces/ITokenKeyData";
import { LoginUserTFA } from "@core/interfaces/services/IClient.service";

export interface SendCodeTFARequest {
  tokenKeyData: ITokenKeyData;
  type: TFAType;
  login: string;
}

export interface SendCodeLoginTFARequest {
  tokenKeyData: ITokenKeyData;
  type: TFAType;
  loginUserTFA: LoginUserTFA;
}
