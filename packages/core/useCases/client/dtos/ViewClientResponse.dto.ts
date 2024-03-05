import { Gender, Status } from "@core/common/enums/models/client";

export interface ViewClientResponse {
  status: Status;
  first_name?: string;
  last_name?: string;
  birthday?: Date;
  email?: string;
  phone: string;
  cpf?: string;
  gender?: Gender;
  obs?: string;
}
