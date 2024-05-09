import { PartnerStatus } from "@core/common/enums/models/partner";

export interface UpdatePartnerRequest {
  id_company_type: number;
  status: PartnerStatus;
  trade_name: string;
  legal_name:string;
  responsible_name: string;
  responsible_lastname: string;
  responsible_email: string;
  phone: number;
  cnpj: number;
  obs: string;
}
