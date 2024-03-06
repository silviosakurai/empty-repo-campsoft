import { ClientGender, ClientStatus } from "@core/common/enums/models/client";

export interface LoginResponse {
  client_id: string;
  status: ClientStatus;
  client_id_type: number;
  facebook_id?: bigint;
  name?: string;
  surname?: string;
  birth_date?: Date;
  email?: string;
  phone: string;
  cpf?: string;
  gender?: ClientGender;
}
