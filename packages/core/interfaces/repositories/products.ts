import { Status } from "@core/common/enums/Status";

export interface ProductDto {
  product_id: string;
  status: Status | null;
  name: string | null;
  long_description: string | null;
  short_description: string | null;
  marketing_phrases: string | null;
  content_provider_name: string | null;
  slug: string | null;
  images: {
    main_image: string | null;
    icon: string | null;
    logo: string | null;
    background_image: string | null;
  };
  how_to_access: {
    desktop: string | null;
    mobile: string | null;
    url_web: string | null;
    url_ios: string | null;
    url_android: string | null;
  };
  product_type: {
    product_type_id: number;
    product_type_name: string | null;
  };
  prices: {
    face_value: number | null;
    price: number | null;
  };
  created_at: string | null;
  updated_at: string | null;
  company_id: number;
  company_name: string | null;
}

interface Images {
  main_image: string;
  icon: string;
  logo: string;
  background_image: string;
}

interface HowTo {
  desktop: string;
  mobile: string;
  url_web: string;
  url_ios: string;
  url_android: string;
}

interface ProductType {
  product_type_id: number;
  product_type_name: string;
}

interface Prices {
  face_value: number;
  price: number;
}

interface Company {
  company_id: number;
  company_name: string;
}

export interface ProductDtoResponse {
  product_id: string;
  status: Status | null;
  name: string | null;
  long_description: string | null;
  short_description: string | null;
  marketing_phrases: string | null;
  content_provider_name: string | null;
  slug: string | null;
  images: Images | null;
  how_to_access: HowTo | null;
  product_type: ProductType | null;
  prices: Prices | null;
  companies: Company[] | null;
  created_at: string;
  updated_at: string;
}

export interface ProductImageRepositoryCreateInput {
  imageUrl: string | null;
  iconUrl: string | null;
  logoUrl: string | null;
}
