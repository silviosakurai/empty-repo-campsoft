import { IHeaderTransactionRequest } from "./IHeaderTransactionRequest";

export interface ITransactionSimpleTicketRequest
  extends IHeaderTransactionRequest {
  customerId: string;
  reference_id?: string;
}
export interface ITransactionSimpleTicketResponse {
  id: string;
  resource: string;
  status: "pending" | "failed" | "approved";
  amount: string;
  original_amount: string;
  currency: string;
  description: string;
  payment_type: string;
  transaction_number: null | string;
  gateway_authorizer: string;
  app_transaction_uid: null | string;
  refunds: null | unknown;
  rewards: null | unknown;
  discounts: null | unknown;
  pre_authorization: null | unknown;
  sales_receipt: null | unknown;
  on_behalf_of: string;
  customer: string;
  statement_descriptor: string;
  payment_method: {
    id: string;
    zoop_boleto_id: string;
    resource: string;
    description: string;
    reference_number: string;
    document_number: string;
    expiration_date: string;
    payment_limit_date: null | string;
    recipient: string;
    bank_code: string;
    customer: string;
    address: null | unknown;
    sequence: string;
    url: string;
    accepted: boolean;
    printed: boolean;
    downloaded: boolean;
    fingerprint: null | unknown;
    paid_at: null | string;
    uri: string;
    barcode: string;
    metadata: Record<string, unknown>;
    created_at: string;
    updated_at: string;
    status: string;
  };
  source: null | unknown;
  point_of_sale: {
    entry_mode: string;
    identification_number: null | string;
  };
  installment_plan: null | unknown;
  refunded: boolean;
  voided: boolean;
  captured: boolean;
  fees: string;
  fee_details: null | unknown;
  location_latitude: null | string;
  location_longitude: null | string;
  uri: string;
  metadata: Record<string, unknown>;
  expected_on: null | string;
  created_at: string;
  updated_at: string;
  reference_id: string;
  payment_authorization: null | unknown;
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
