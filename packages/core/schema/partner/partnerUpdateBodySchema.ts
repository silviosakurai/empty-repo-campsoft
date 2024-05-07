import { Type } from "@sinclair/typebox";
import { PartnerStatus } from "@core/common/enums/models/partner";

export const partnerUpdateBodySchema = Type.Object({
  id_company_type: Type.Number(),
	status: Type.String({ enum: Object.values(PartnerStatus) }),
	trade_name: Type.String(),
	legal_name: Type.String(),
	responsible_name: Type.String(),
	responsible_lastname: Type.String(),
	responsible_email: Type.String(),
	phone: Type.Number(),
	cnpj: Type.Number(),
	obs: Type.String(),
});
