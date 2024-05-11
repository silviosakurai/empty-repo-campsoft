import { injectable } from "tsyringe";
import { MarketingProductListerRepository } from "@core/repositories/marketing/MarketingProductLister.repository";

@injectable()
export class MarketingService {
  constructor(
    private readonly marketingProductListerRepository: MarketingProductListerRepository
  ) {}

  list = async (productId: string) => {
    return this.marketingProductListerRepository.list(productId);
  };
}
