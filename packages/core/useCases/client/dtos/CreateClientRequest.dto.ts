import { ClientGender } from "@core/common/enums/models/client";

export interface CreateClientRequestDto {
  status: string;
  first_name: string;
  last_name: string;
  birthday: string;
  email: string;
  phone: string;
  cpf: string;
  password: string;
  gender: ClientGender;
  obs: string;
}
