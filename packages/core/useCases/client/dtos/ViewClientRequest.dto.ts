import { ITokenKeyData } from "@core/common/interfaces/ITokenKeyData";

export interface ViewClientRequest {
  tokenKeyData: ITokenKeyData;
  userId: string;
}
