export interface ListProductGroupResponse {
  product_group_id: number;
  name: string | null;
  choices: number | null;
  products: (string | null)[];
}

export interface ListProductGroupPreviewResponse {
  product_group_id: number;
  name: string | null;
  choices: number | null;
}
