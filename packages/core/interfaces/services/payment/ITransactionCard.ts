import { IHeaderTransactionRequest } from "./IHeaderTransactionRequest";

export interface ITransactionCardRequest extends IHeaderTransactionRequest {
  cardNumber: string;
  holderName: string;
  expirationMonth: string;
  expirationYear: string;
  securityCode: string;
  installments: number;
  usage: string;
}

export interface ITransactionCardIdRequest extends IHeaderTransactionRequest {
  cardId: string;
  usage: "single_use";
  reference_id: string;
}

export interface ITransactionCardResponse {
  id: string;
  status: string;
  resource: string;
  amount: string;
  original_amount: string;
  currency: string;
  description: string;
  payment_type: string;
  transaction_number: string;
  sales_receipt: string;
  on_behalf_of: string;
  statement_descriptor: string;
  payment_method: {
    id: string;
    resource: string;
    description: string;
    card_brand: string;
    first4_digits: string;
    last4_digits: string;
    expiration_month: string;
    expiration_year: string;
    holder_name: string;
    is_active: boolean;
    is_valid: boolean;
    is_verified: boolean;
    customer: string;
    fingerprint: string;
    uri: string;
    created_at: string;
    updated_at: string;
  };
  refunded: boolean;
  voided: boolean;
  captured: boolean;
  fees: string;
}
