import { UserGenderEnum } from "@core/common/enums/UserGender";

export interface CreateClientRequestDto {
  status: string;
  first_name: string;
  last_name: string;
  birthday: string;
  email: string;
  phone: string;
  cpf: string;
  password: string;
  gender: UserGenderEnum;
  obs: string;
}
