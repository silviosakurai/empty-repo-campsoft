export interface ISignatureFindByClientId {
  product_id: string;
}

export interface ISignatureFindByOrder {
  signature_id: string;
  product_id: string;
  product_cancel_date: string;
}
