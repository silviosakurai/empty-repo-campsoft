import { IHeaderTransactionRequest } from './IHeaderTransactionRequest';

export interface ITransactionSimpleTicketRequest extends IHeaderTransactionRequest {
  customerId: string;
  reference_id: string;
}
export interface ITransactionSimpleTicketResponse {
  id: string;
  payment_method: {
    id: string;
    zoop_boleto_id: string;
    resource: string;
    description: string;
    reference_number: string;
    document_number: string;
    expiration_date: string;
    payment_limit_date: string;
    recipient: string;
    bank_code: string;
    customer: string;
    address: string;
    sequence: string;
    url: string;
    barcode: string;
    created_at: string;
    updated_at: string;
    status: string;
  };
}
