import { ClientGender } from "@core/common/enums/models/client";
import { userDetailsGroupedByCompanySchema } from "@core/schema/user/userDetailsGroupedByCompanySchema";
import { Static } from "@sinclair/typebox";

export type ClientResponse = Static<typeof userDetailsGroupedByCompanySchema>;

export interface ListWithCompanies {
  user_id: string;
  status: string;
  name: string | null;
  first_name: string | null;
  last_name: string | null;
  birthday: string;
  email: string | null;
  phone: string;
  cpf: string | null;
  gender: ClientGender | null;
  photo: string | null;
  obs: string | null;
}
