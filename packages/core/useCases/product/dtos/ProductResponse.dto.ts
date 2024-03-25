import { Status } from "@core/common/enums/Status";

export interface ProductResponse {
  product_id: string;
  status: Status;
  name: string;
  long_description: string;
  short_description: string;
  marketing_phrases: string;
  content_provider_name: string;
  slug: string;
  images: {
    main_image: string;
    icon: string;
    logo: string;
    background_image: string;
  };
  how_to_access: {
    desktop: string;
    mobile: string;
    url_web: string;
    url_ios: string;
    url_android: string;
  };
  product_type: {
    product_type_id: number;
    product_type_name: string;
  };
  price: {
    months: number;
    price: number;
    discount_value: number;
    discount_percentage: number;
    price_with_discount: number;
  };
  created_at: string;
  updated_at: string;
}
