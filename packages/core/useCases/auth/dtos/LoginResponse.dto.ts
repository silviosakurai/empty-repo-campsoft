import { Gender, Status } from "@core/common/enums/models/client";

export interface LoginResponse {
  client_id: Buffer;
  status: Status;
  client_id_type: number;
  facebook_id?: bigint;
  name?: string;
  surname?: string;
  birth_date?: Date;
  email?: string;
  phone: string;
  cpf?: string;
  gender?: Gender;
}
