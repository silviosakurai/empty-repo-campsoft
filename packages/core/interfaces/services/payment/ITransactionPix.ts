import { WebhookTypeEnum } from "@core/common/enums/Webhook";
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

export interface ITransactionPixWebhookSuccessResponse {
  id: string; // "205a89472aa04100be54ac17da714e7c"
  type: WebhookTypeEnum.TRANSACTION_SUCCEEDED; // "transaction.succeeded"
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
