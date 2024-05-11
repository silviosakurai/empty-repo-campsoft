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
  resource: string;
  status: string;
  amount: string;
  original_amount: string;
  currency: string;
  description: null | string;
  payment_type: string;
  transaction_number: string;
  gateway_authorizer: string;
  app_transaction_uid: null | string;
  refunds: null | any[];
  rewards: null | any[];
  discounts: null | any[];
  pre_authorization: unknown;
  sales_receipt: string;
  on_behalf_of: string;
  customer: string;
  statement_descriptor: string;
  payment_method: {
    id: string;
    resource: string;
    description: null | string;
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
    address: unknown;
    verification_checklist: any[];
    metadata: Record<string, any>;
    uri: string;
    created_at: string;
    updated_at: string;
  };
  source: {
    id: string;
    status: string;
    usage: string;
    amount: string;
    currency: string;
    description: null | string;
    statement_descriptor: null | string;
    type: string;
    card: Record<string, any>;
  };
  point_of_sale: {
    entry_mode: string;
    identification_number: null | string;
  };
  installment_plan: unknown;
  refunded: boolean;
  voided: boolean;
  captured: boolean;
  fees: string;
  fee_details: Record<string, any>[];
  location_latitude: null | string;
  location_longitude: null | string;
  uri: string;
  metadata: Record<string, any>;
  expected_on: string;
  created_at: string;
  updated_at: string;
  payment_authorization: {
    authorizer_id: string;
    authorization_code: string;
    authorization_nsu: string;
  };
  history: {
    id: string;
    transaction: string;
    amount: string;
    operation_type: string;
    status: string;
    response_code: null | string;
    response_message: null | string;
    authorization_code: null | string;
    authorizer_id: null | string;
    authorization_nsu: null | string;
    gatewayResponseTime: null | string;
    authorizer: null | string;
    created_at: string;
  }[];
}
