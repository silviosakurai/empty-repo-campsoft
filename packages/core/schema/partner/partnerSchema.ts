import { Type } from "@sinclair/typebox";
import { Status } from "@core/common/enums/Status";

export const partnerSchema = Type.Object({
  id_company: Type.Number(),
  id_company_type: Type.Number(),
  status: Type.String({ enum: Object.values(Status) }),
  trade_name: Type.String(),
  legal_name: Type.String(),
  responsible_name: Type.String(),
  responsible_lastname: Type.String(),
  responsible_email: Type.String(),
  phone: Type.Number(),
  cnpj: Type.Number(),
  obs: Type.String(),
  created_at: Type.String({ format: "date-time" }),
  updated_at: Type.String({ format: "date-time" }),
});
