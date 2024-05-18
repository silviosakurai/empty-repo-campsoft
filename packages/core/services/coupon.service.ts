import { injectable } from "tsyringe";
import { ITokenKeyData } from "@core/common/interfaces/ITokenKeyData";
import { CouponListerRepository } from "@core/repositories/coupon/CouponLister.repository";
import { ITokenJwtData } from "@core/common/interfaces/ITokenJwtData";
import { ICouponVerifyEligibilityUser } from "@core/interfaces/repositories/coupon";
import { PlanPrice } from "@core/common/enums/models/plan";
import { TFunction } from "i18next";
import { CouponViewerByIdRepository } from "@core/repositories/coupon/CouponViewerById.repository";
import { CouponUpdaterRepository } from "@core/repositories/coupon/CouponUpdater.repository";
import { CreateCartRequest } from "@core/useCases/cart/dtos/CreateCartRequest.dto";

@injectable()
export class CouponService {
  constructor(
    private readonly couponListerRepository: CouponListerRepository,
    private readonly couponViewerByIdRepository: CouponViewerByIdRepository,
    private readonly couponUpdaterRepository: CouponUpdaterRepository
  ) {}

  verifyEligibilityCoupon = async (
    tokenKeyData: ITokenKeyData,
    couponCode: string,
    planId: number,
    selectedProducts: string[] | null | undefined
  ): Promise<ICouponVerifyEligibilityUser[] | null> => {
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
    isEligibility: ICouponVerifyEligibilityUser[],
    couponCode: string
  ) => {
    return this.couponListerRepository.verifyRedemptionCouponByUser(
      tokenKeyData,
      tokenJwtData,
      isEligibility,
      couponCode
    );
  };

  applyDiscountCoupon = (
    coupon: ICouponVerifyEligibilityUser[],
    planPrice: PlanPrice,
    payload: CreateCartRequest,
    finalPrice: number
  ): PlanPrice => {
    let discountCoupon = 0;

    const findPlan = coupon.find(
      (item) => item.id_plano === payload.plan.plan_id
    );

    if (findPlan) {
      const discountValue = finalPrice * findPlan.desconto_percentual;

      finalPrice -= discountValue;
      discountCoupon += discountValue;
    }

    const discountValue = Number(planPrice.price) - finalPrice;
    const discountPercentage = (discountValue / Number(planPrice.price)) * 100;

    return {
      months: planPrice.months,
      price: planPrice.price,
      discount_value: Number(discountValue.toFixed(2)),
      discount_percentage: Number(discountPercentage.toFixed(2)),
      price_with_discount: Math.max(0, Number(finalPrice.toFixed(2))),
      discount_coupon: Number(discountCoupon.toFixed(2)),
    };
  };

  applyAndValidateDiscountCoupon = async (
    t: TFunction<"translation", undefined>,
    tokenKeyData: ITokenKeyData,
    tokenJwtData: ITokenJwtData,
    payload: CreateCartRequest
  ): Promise<ICouponVerifyEligibilityUser[]> => {
    if (!payload.coupon_code) {
      return [] as ICouponVerifyEligibilityUser[];
    }

    const isEligibility = await this.verifyEligibilityCoupon(
      tokenKeyData,
      payload.coupon_code,
      payload.plan.plan_id,
      payload?.products
    );

    if (!isEligibility || isEligibility.length === 0) {
      throw new Error(t("coupon_not_eligible"));
    }

    const isRedemption = await this.verifyRedemptionCouponByUser(
      tokenKeyData,
      tokenJwtData,
      isEligibility,
      payload.coupon_code
    );

    if (!isRedemption) {
      throw new Error(t("coupon_not_redeemable"));
    }

    return isEligibility;
  };

  async view(couponId: number, companyId: number) {
    return this.couponViewerByIdRepository.view(couponId, companyId);
  }

  updateCoupon = async (coupon: string) => {
    return this.couponUpdaterRepository.updateCoupon(coupon);
  };
}
