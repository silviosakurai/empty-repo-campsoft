import { PartnerStatus } from "@core/common/enums/models/partner";

export interface ListPartnerRequest {
  id?: number;
  id_partner_type?: number;
  status?: PartnerStatus;
  trade_name?: string;
  legal_name?: string;
  cnpj?: number;
  per_page: number;
  current_page: number;
}
