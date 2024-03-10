import { TFAType } from "@core/common/enums/models/tfa";

export interface ViewApiTfaResponse {
  type: TFAType;
  destiny: string;
}
