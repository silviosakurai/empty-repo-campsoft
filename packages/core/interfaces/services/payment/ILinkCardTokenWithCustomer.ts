export interface ILinkCardTokenWithCustomerResponse {
  id: string;
  resource: string;
  description: string | null;
  card_brand: string;
  first4_digits: number;
  last4_digits: number;
  expiration_month: number;
  expiration_year: number;
  holder_name: string;
  is_active: boolean;
  is_valid: boolean;
  is_verified: boolean;
  customer: string;
  fingerprint: string;
  address: string | null;
  verification_checklist: {
    postal_code_check: string;
    security_code_check: string;
    address_line1_check: string;
  };
  metadata: {};
  uri: string;
  created_at: string;
  updated_at: string;
}
