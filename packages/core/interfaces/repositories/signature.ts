export interface ISignatureFindByClientId {
  product_id: string;
}

export interface ISignatureFindByOrder {
  signature_id: string;
  product_id: string;
  product_cancel_date: string;
}

export interface ISignatureByOrder {
  signature_id: string;
  plan_id: number;
  recurrence: number;
  recurrence_period: number;
  cycle: number;
  start_date: string;
  signature_date: string;
  next_billing_date: string;
}

export interface ISignatureActiveByClient {
  product_id: string;
  discount_percentage: number;
}
