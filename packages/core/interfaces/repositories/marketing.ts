import {
  ebooksAudiolivrosListSchema,
  marketingProductHighlightsListSchema,
  marketingProductInstitucionalListSchema,
  marketingProductInstitutionalMiddleListSchema,
  marketingProductMagazinesListSchema,
  marketingProductNumbersListSchema,
  marketingProductSectionsListSchema,
  reviewListResponseSchema,
} from "@core/schema/product/productViewSchema";
import { Static } from "@sinclair/typebox";

export type MarketingProductInstitucionalList = Static<
  typeof marketingProductInstitucionalListSchema
>;

export type MarketingProductHighlightsList = Static<
  typeof marketingProductHighlightsListSchema
>;

export type MarketingProductMagazinesList = Static<
  typeof marketingProductMagazinesListSchema
>;

export type MarketingProductSectionsList = Static<
  typeof marketingProductSectionsListSchema
>;

export type EbooksAudiolivrosListSchema = Static<
  typeof ebooksAudiolivrosListSchema
>;

export type MarketingProductInstitutionalMiddleList = Static<
  typeof marketingProductInstitutionalMiddleListSchema
>;

export type MarketingProductNumbersList = Static<
  typeof marketingProductNumbersListSchema
>;

export type ReviewListResponse = Static<typeof reviewListResponseSchema>;

export interface MarketingProductList {
  marketing_produto_id: number;
  marketing_produto_tipo_id: number;
  id_produto: string;
  titulo: string;
  sub_titulo: string;
  descricao: string;
  url_imagem: string;
  url_video: string;
}
