import { ClientGender, ClientStatus } from "@core/common/enums/models/client";

export interface ViewClientResponse {
  client_id: string;
  status: ClientStatus;
  first_name?: string;
  last_name?: string;
  birthday?: Date;
  email?: string;
  phone: string;
  cpf?: string;
  gender?: ClientGender;
  obs?: string;
}
