export interface ISaveCardTokenRequest {
  holderName: string;
  expirationMonth: string;
  expirationYear: string;
  cardNumber: string;
  securityCode: string;
}
export interface ISaveCardTokenResponse {
  id: string;
  resource: string;
  used: string;
  type: string;
  card: {
    id: string;
    resource: string;
    description: string;
    card_brand: string;
    first4_digits: string;
    expiration_month: string;
    expiration_year: string;
    holder_name: string;
    is_active: boolean;
    is_valid: boolean;
    is_verified: boolean;
    customer: string;
    fingerprint: string;
    address: string;
    postal_code_check: string;
    security_code_check: string;
    address_line1_check: string;
    uri: string;
    created_at: string;
    updated_at: string;
  };
}
