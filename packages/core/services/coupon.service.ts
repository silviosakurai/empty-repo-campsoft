import { CouponViewerByIdRepository } from "@core/repositories/coupon/CouponViewerById.repository";
import { injectable } from "tsyringe";

@injectable()
export class CouponService {
  constructor(
    private readonly couponViewerByIdRepository: CouponViewerByIdRepository
  ) {}

  async view(couponId: number, companyId: number) {
    return this.couponViewerByIdRepository.view(couponId, companyId);
  }
}
