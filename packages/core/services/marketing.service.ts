import { injectable } from "tsyringe";
import { MarketingProductInstitucionalListerRepository } from "@core/repositories/marketing/MarketingProductInstitucionalLister.repository";
import { MarketingProductHighlightsListerRepository } from "@core/repositories/marketing/MarketingProductHighlightsLister.repository";
import { MarketingProductMagazinesListerRepository } from "@core/repositories/marketing/MarketingProductMagazinesLister.repository";

@injectable()
export class MarketingService {
  constructor(
    private readonly marketingProductInstitucionalListerRepository: MarketingProductInstitucionalListerRepository,
    private readonly marketingProductHighlightsListerRepository: MarketingProductHighlightsListerRepository,
    private readonly marketingProductMagazinesListerRepository: MarketingProductMagazinesListerRepository
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
}
