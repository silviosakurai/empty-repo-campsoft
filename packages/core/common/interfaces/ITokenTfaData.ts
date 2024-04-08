import { TFAType } from "@core/common/enums/models/tfa";

export interface ITokenTfaData {
  clientId: string;
  type: TFAType;
  destiny: string;
}
