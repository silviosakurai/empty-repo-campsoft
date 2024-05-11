import { ClientGender, ClientStatus } from "@core/common/enums/models/client";

export interface UpdateClientRequestDto {
  status: ClientStatus;
  first_name: string;
  last_name: string;
  birthday: string;
  gender: ClientGender;
  obs: string;
}
