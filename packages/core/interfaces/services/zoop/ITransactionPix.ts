import { IHeaderTransactionRequest } from './IHeaderTransactionRequest';

export interface ITransactionPixRequest extends IHeaderTransactionRequest {
  expiration: string;
}

export interface ITransactionPixResponse {
  id: string;
  resource: string;
  status: string;
  amount: number;
  original_amount: number;
  currency: string;
  description: string;
  payment_type: string;
  transaction_number: string;
  gateway_authorizer: string;
  app_transaction_uid: string;
  refunds: string;
  rewards: string;
  discounts: string;
  pre_authorization: string;
  sales_receipt: string;
  on_behalf_of: string;
  customer: string;
  statement_descriptor: string;
  payment_method: {
    id: string;
    provider: string;
    version: number;
    type: string;
    reusable: boolean;
    allow_update: boolean;
    expiration_date: string;
    pix_link: string;
    qr_code: {
      emv: string;
    };
  };
}
