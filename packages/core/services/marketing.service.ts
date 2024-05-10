import { injectable } from "tsyringe";
import { MarketingProductInstitucionalListerRepository } from "@core/repositories/marketing/MarketingProductInstitucionalLister.repository";
import { MarketingProductHighlightsListerRepository } from "@core/repositories/marketing/MarketingProductHighlightsLister.repository";

@injectable()
export class MarketingService {
  constructor(
    private readonly marketingProductInstitucionalListerRepository: MarketingProductInstitucionalListerRepository,
    private readonly marketingProductHighlightsListerRepository: MarketingProductHighlightsListerRepository
  ) {}

  list = async (productId: string) => {
    return this.marketingProductInstitucionalListerRepository.list(productId);
  };

  listHighlights = async (productId: string) => {
    return this.marketingProductHighlightsListerRepository.list(productId);
  };
}
