import { IHeaderTransactionRequest } from "./IHeaderTransactionRequest";

export interface ITransactionPixRequest extends IHeaderTransactionRequest {
  expiration?: string;
}

export interface ITransactionPixResponse {
  id: string;
  resource: string;
  status: string;
  amount: string;
  original_amount: string;
  currency: string;
  description: string | null;
  payment_type: string;
  transaction_number: string | null;
  gateway_authorizer: string;
  app_transaction_uid: string | null;
  refunds: any[] | null;
  rewards: any[] | null;
  discounts: any[] | null;
  pre_authorization: any[] | null;
  sales_receipt: any[] | null;
  on_behalf_of: string;
  customer: any[] | null;
  statement_descriptor: string;
  payment_method: {
    id: string;
    provider: string;
    version: string;
    type: string;
    reusable: boolean;
    allow_update: boolean;
    expiration_date: string;
    key: {
      type: string;
      value: string;
    };
    pix_link: string;
    qr_code: {
      emv: string;
    };
  };
  source: any[] | null;
  point_of_sale: {
    entry_mode: string;
    identification_number: string | null;
  };
  installment_plan: any[] | null;
  refunded: boolean;
  voided: boolean;
  captured: boolean;
  fees: string;
  fee_details: any[] | null;
  location_latitude: number | null;
  location_longitude: number | null;
  uri: string;
  metadata: Record<string, any>;
  expected_on: string;
  created_at: string;
  updated_at: string;
  payment_authorization: any[] | null;
  history: {
    id: string;
    transaction: string;
    amount: string;
    operation_type: string;
    status: string;
    response_code: string | null;
    response_message: string | null;
    authorization_code: string | null;
    authorizer_id: string | null;
    authorization_nsu: string | null;
    gatewayResponseTime: string | null;
    authorizer: string | null;
    created_at: string;
  }[];
}
