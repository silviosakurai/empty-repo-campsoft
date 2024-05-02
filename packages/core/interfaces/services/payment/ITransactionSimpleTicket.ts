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
  refunds: unknown;
  rewards: unknown;
  discounts: unknown;
  pre_authorization: unknown;
  sales_receipt: unknown;
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
    address: unknown;
    sequence: string;
    url: string;
    accepted: boolean;
    printed: boolean;
    downloaded: boolean;
    fingerprint: unknown;
    paid_at: null | string;
    uri: string;
    barcode: string;
    metadata: Record<string, unknown>;
    created_at: string;
    updated_at: string;
    status: string;
  };
  source: unknown;
  point_of_sale: {
    entry_mode: string;
    identification_number: null | string;
  };
  installment_plan: unknown;
  refunded: boolean;
  voided: boolean;
  captured: boolean;
  fees: string;
  fee_details: unknown;
  location_latitude: null | string;
  location_longitude: null | string;
  uri: string;
  metadata: {};
  expected_on: null | string;
  created_at: string;
  updated_at: string;
  reference_id: string;
  payment_authorization: unknown;
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

export interface ITransactionSimpleTicketWebhookSuccessResponse {
  id: string; // "205a89472aa04100be54ac17da714e7c"
  type: string; // "transaction.succeeded"
  resource: string; // "event"
  source: string | null; // null
  name: string | null; // null
  uri: string; // "/v1/marketplaces/eb9ed3e5c3d84aa792d95460ae07a69a/events/205a89472aa04100be54ac17da714e7c"
  created_at: string; // "2024-05-02T18:06:41+0000"
  updated_at: string; // "2024-05-02T18:06:41+0000"
  payload: {
    id: string; // "7d838389d6164a518a7decfd7d9ec7e4"
    resource: string; // "transaction"
    status: string; // "succeeded"
    confirmed: boolean; // true
    amount: string; // "3.00"
    original_amount: string; // "3.00"
    currency: string; // "BRL"
    description: string | null; // null
    payment_type: string; // "pix"
    transaction_number: string | null; // null
    gateway_authorizer: string; // "zoop"
    app_transaction_uid: string | null; // null
    refunds: unknown;
    rewards: unknown;
    discounts: unknown;
    pre_authorization: unknown;
    sales_receipt: string; // "b98d5d5790da4fcca8e551ee999ce1dc"
    on_behalf_of: string; // "0e2c5d6bb9b44c55b8129372432e7f7e"
    customer: unknown;
    statement_descriptor: string; // "MANIA APLICATIVOS DIGITAIS LTDA"
    payment_method: any; //
    point_of_sale: any; //
    installment_plan: unknown;
    refunded: boolean; // false
    voided: boolean; // false
    captured: boolean; // true
    fees: string; // "0.60"
    fee_details: any[]; // []
    location_latitude: number | null; // null
    location_longitude: number | null; // null
    individual: unknown; // null
    business: unknown; // null
    uri: string; // "/v1/marketplaces/eb9ed3e5c3d84aa792d95460ae07a69a/transactions/7d838389d6164a518a7decfd7d9ec7e4"
    metadata: unknown;
    expected_on: string; // "2024-05-03T00:00:00+00:00"
    created_at: string; // "2024-05-02T18:04:39+00:00"
    updated_at: string; // "2024-05-02T18:04:39+00:00"
    history: any[]; // []
  };
}
