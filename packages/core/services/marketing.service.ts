import { injectable } from "tsyringe";
import { MarketingProductInstitucionalListerRepository } from "@core/repositories/marketing/MarketingProductInstitucionalLister.repository";

@injectable()
export class MarketingService {
  constructor(
    private readonly marketingProductInstitucionalListerRepository: MarketingProductInstitucionalListerRepository
  ) {}

  list = async (productId: string) => {
    return this.marketingProductInstitucionalListerRepository.list(productId);
  };
}
