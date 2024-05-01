import { ClientGender, ClientStatus } from "@core/common/enums/models/client";

export interface UpdateClientByIdRequestDto {
  status: ClientStatus;
  first_name: string;
  last_name: string;
  birthday: string;
  email: string;
  phone: string;
  gender: ClientGender;
  obs: string;
}
