export enum ProductFields {
  product_id = "product_id",
  name = "name",
  content_provider_name = "content_provider_name",
  slug = "slug",
}

export enum ProductFieldsPT {
  id_produto = "id_produto",
  produto = "produto",
  conteudista_nome = "conteudista_nome",
  url_caminho = "url_caminho",
}

export type ProductGroupProduct = {
  product_id: string;
  product_group_id: number;
  name: string | null;
  quantity: number;
};

export type ProductGroupProductList = {
  productId: string | null;
};

export type ProductGroup = {
  product_group_id: number;
  name: string | null;
  quantity: number;
};

export const ProductFieldsToOrder = {
  [ProductFields.product_id]: ProductFieldsPT.id_produto,
  [ProductFields.name]: ProductFieldsPT.produto,
  [ProductFields.content_provider_name]: ProductFieldsPT.conteudista_nome,
  [ProductFields.slug]: ProductFieldsPT.url_caminho,
};

export enum ProductVoucherStatus {
  IN_USE = "in_use",
  IN_ADDITION = "in_addition",
  ACTIVE = "active",
  EXPIRED = "expired",
}

export enum ProductGroupImageType {
  ICON = "icon",
}
