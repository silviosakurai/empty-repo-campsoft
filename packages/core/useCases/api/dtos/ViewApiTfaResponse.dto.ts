import { TFAType } from "@core/common/enums/models/tfa";

export interface ViewApiTfaResponse {
  clientId: string;
  type: TFAType;
  destiny: string;
}
