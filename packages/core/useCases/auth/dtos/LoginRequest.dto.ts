import { ITokenKeyData } from "@core/common/interfaces/ITokenKeyData";

export interface LoginRequest {
  tokenKeyData: ITokenKeyData;
  login: string;
  password: string;
}
