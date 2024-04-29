import { ClientGender, ClientStatus } from "@core/common/enums/models/client";

export interface UpdateClientByIdRequestDto {
  leader_id: string;
  status: ClientStatus;
  first_name: string;
  last_name: string;
  birthday: string;
  email: string;
  phone: string;
  gender: ClientGender;
  obs: string;
}
