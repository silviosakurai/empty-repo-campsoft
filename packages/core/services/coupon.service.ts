import { injectable } from "tsyringe";
import { ITokenKeyData } from "@core/common/interfaces/ITokenKeyData";
import { CouponListerRepository } from "@core/repositories/coupon/CouponLister.repository";
import { ITokenJwtData } from "@core/common/interfaces/ITokenJwtData";
import { ICouponVerifyEligibilityUser } from "@core/interfaces/repositories/coupon";

@injectable()
export class CouponService {
  constructor(
    private readonly couponListerRepository: CouponListerRepository
  ) {}

  verifyEligibilityCoupon = async (
    tokenKeyData: ITokenKeyData,
    couponCode: string,
    planId: number,
    selectedProducts: string[] | null
  ): Promise<ICouponVerifyEligibilityUser | null> => {
    return this.couponListerRepository.verifyEligibilityCoupon(
      tokenKeyData,
      couponCode,
      planId,
      selectedProducts
    );
  };

  verifyRedemptionCouponByUser = async (
    tokenKeyData: ITokenKeyData,
    tokenJwtData: ITokenJwtData,
    isEligibility: ICouponVerifyEligibilityUser,
    couponCode: string
  ) => {
    return this.couponListerRepository.verifyRedemptionCouponByUser(
      tokenKeyData,
      tokenJwtData,
      isEligibility,
      couponCode
    );
  };
}
