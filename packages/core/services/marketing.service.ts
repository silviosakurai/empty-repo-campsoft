import { injectable } from "tsyringe";
import { MarketingProductInstitucionalListerRepository } from "@core/repositories/marketing/MarketingProductInstitucionalLister.repository";
import { MarketingProductHighlightsListerRepository } from "@core/repositories/marketing/MarketingProductHighlightsLister.repository";
import { MarketingProductMagazinesListerRepository } from "@core/repositories/marketing/MarketingProductMagazinesLister.repository";
import { MarketingProductSectionListerRepository } from "@core/repositories/marketing/MarketingProductSectionLister.repository";

@injectable()
export class MarketingService {
  constructor(
    private readonly marketingProductInstitucionalListerRepository: MarketingProductInstitucionalListerRepository,
    private readonly marketingProductHighlightsListerRepository: MarketingProductHighlightsListerRepository,
    private readonly marketingProductMagazinesListerRepository: MarketingProductMagazinesListerRepository,
    private readonly marketingProductSectionListerRepository: MarketingProductSectionListerRepository
  ) {}

  list = async (productId: string) => {
    return this.marketingProductInstitucionalListerRepository.list(productId);
  };

  listHighlights = async (productId: string) => {
    return this.marketingProductHighlightsListerRepository.list(productId);
  };

  listMagazines = async (productId: string) => {
    return this.marketingProductMagazinesListerRepository.list(productId);
  };

  listSection = async (productId: string) => {
    return this.marketingProductSectionListerRepository.list(productId);
  };
}
