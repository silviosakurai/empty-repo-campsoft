import { injectable } from "tsyringe";
import { ITokenKeyData } from "@core/common/interfaces/ITokenKeyData";
import { CouponListerRepository } from "@core/repositories/coupon/CouponLister.repository";
import { ITokenJwtData } from "@core/common/interfaces/ITokenJwtData";
import { ICouponVerifyEligibilityUser } from "@core/interfaces/repositories/coupon";
import { PlanPrice } from "@core/common/enums/models/plan";
import { CreateOrderRequestDto } from "@core/useCases/order/dtos/CreateOrderRequest.dto";
import { TFunction } from "i18next";

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
    payload: CreateOrderRequestDto,
    finalPrice: number
  ): PlanPrice => {
    const findPlan = coupon.find(
      (item) => item.id_plano === payload.plan.plan_id
    );

    if (findPlan) {
      finalPrice -= finalPrice * findPlan.desconto_percentual;
    }

    const discountValue = Number(planPrice.price) - finalPrice;
    const discountPercentage = (discountValue / Number(planPrice.price)) * 100;

    return {
      months: planPrice.months,
      price: planPrice.price,
      discount_value: Number(discountValue.toFixed(2)),
      discount_percentage: Number(discountPercentage.toFixed(2)),
      price_with_discount: Number(finalPrice.toFixed(2)),
    };
  };

  applyAndValidateDiscountCoupon = async (
    t: TFunction<"translation", undefined>,
    tokenKeyData: ITokenKeyData,
    tokenJwtData: ITokenJwtData,
    payload: CreateOrderRequestDto
  ): Promise<ICouponVerifyEligibilityUser[]> => {
    if (!payload.coupon_code) {
      return [] as ICouponVerifyEligibilityUser[];
    }

    const isEligibility = await this.verifyEligibilityCoupon(
      tokenKeyData,
      payload.coupon_code,
      payload.plan.plan_id,
      payload.products
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
}
