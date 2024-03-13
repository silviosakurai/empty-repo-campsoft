export enum ProductStatus {
  ACTIVE = "ativo",
  INACTIVE = "inativo",
}

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

export const ProductFieldsToOrder = {
  [ProductFields.product_id]: ProductFieldsPT.id_produto,
  [ProductFields.name]: ProductFieldsPT.produto,
  [ProductFields.content_provider_name]: ProductFieldsPT.conteudista_nome,
  [ProductFields.slug]: ProductFieldsPT.url_caminho,
}
