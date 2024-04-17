import { ClientGender, ClientStatus } from "@core/common/enums/models/client";

export interface UpdateClientByIdRequestDto {
  user_type: number;
  leader_id: string;
  status: ClientStatus;
  first_name: string;
  last_name: string;
  birthday: Date;
  email: string;
  phone: string;
  gender: ClientGender;
  obs: string;
}
