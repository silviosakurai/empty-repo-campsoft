import { Status } from "@core/common/enums/Status";

export interface CreateProductRequest {
  product_id: string;
  status: Status;
  name: string;
  long_description: string;
  short_description: string;
  marketing_phrases: string;
  content_provider_name: string;
  slug: string;
  product_type_id: number;
  prices: {
    face_value: number;
    price: number;
  };
  obs: string;
}
