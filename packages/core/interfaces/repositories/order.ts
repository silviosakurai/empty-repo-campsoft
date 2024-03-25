export interface ListOrder {
  order_id: string;
  client_id: string;
  seller_id: string;
  status: string;
}

export interface Plan {
  plan_id: number;
  status: string;
  visible_site: boolean;
  business_id: number | null;
  plan: string | null;
  image: string | null;
  description: string | null;
  short_description: string | null;
}
