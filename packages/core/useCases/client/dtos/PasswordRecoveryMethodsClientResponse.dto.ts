import { TFAType } from "@core/common/enums/models/tfa";

export interface PasswordRecoveryMethodsClientResponse {
  client_id: string;
  name: string;
  profile_image: string;
  recovery_types: TFAType[];
}
