import { ProductVoucherStatus } from "@core/common/enums/models/product";

export interface IVerifyEligibilityUser {
  cupom_resgatar_codigo: string;
  qnt_uso_por_cli: number;
}

export interface Images {
  main_image: string;
  icon: string;
  logo: string;
  background_image: string;
}

export interface ProductType {
  product_type_id: number;
  product_type_name: string;
}

export interface ProductDetail {
  product_id: string;
  name: string;
  long_description: string;
  short_description: string;
  marketing_phrases: string;
  content_provider_name: string;
  slug: string;
  images: Images;
  product_type: ProductType;
  status: ProductVoucherStatus;
  current_expiration: string | null;
  expiration_date: string;
  redemption_date: string | null;
}
