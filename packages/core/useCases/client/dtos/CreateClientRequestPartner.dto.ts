import { ClientGender } from "@core/common/enums/models/client";

export interface CreateClientRequestPartnerDto {
  user_type: number;
  leader_id: string;
  first_name: string;
  last_name: string;
  birthday: string;
  email: string;
  phone: string;
  cpf: string;
  gender: ClientGender;
  obs: string;
}
