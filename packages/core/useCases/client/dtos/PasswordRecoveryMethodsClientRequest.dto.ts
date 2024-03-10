import { ITokenKeyData } from "@core/common/interfaces/ITokenKeyData";

export interface PasswordRecoveryMethodsClientRequest {
  tokenKeyData: ITokenKeyData;
  login: string;
}
