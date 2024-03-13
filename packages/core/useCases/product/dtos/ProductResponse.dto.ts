import { ProductStatus } from "@core/common/enums/models/product";

export interface ProductResponse {
  product_id: number;
  status: ProductStatus;
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
  created_at: string;
  updated_at: string;
}
