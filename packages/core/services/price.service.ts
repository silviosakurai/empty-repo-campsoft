import { injectable } from "tsyringe";
import { PlanPrice } from "@core/common/enums/models/plan";
import { CreateOrderRequestDto } from "@core/useCases/order/dtos/CreateOrderRequest.dto";
import { OrderCreatePaymentsCard } from "@core/interfaces/repositories/order";
import { ITokenKeyData } from "@core/common/interfaces/ITokenKeyData";
import { ICouponVerifyEligibilityUser } from "@core/interfaces/repositories/coupon";
import { PlanPriceCrossSellOrder } from "@core/interfaces/repositories/plan";
import { TFunction } from "i18next";
import { ITokenJwtData } from "@core/common/interfaces/ITokenJwtData";
import { ProductService } from "./product.service";
import { CouponService } from "./coupon.service";
import { PlanService } from "./plan.service";

@injectable()
export class PriceService {
  constructor(
    private readonly productService: ProductService,
    private readonly couponService: CouponService,
    private readonly planService: PlanService
  ) {}

  calculatePriceInstallments = (
    payload: CreateOrderRequestDto,
    totalPrices: PlanPrice
  ): OrderCreatePaymentsCard | null => {
    const installments = payload.payment?.credit_card?.installments ?? 1;

    const price = Number(totalPrices.price_with_discount);
    const priceInstallments = price / installments;

    return {
      installments,
      value: Number(priceInstallments.toFixed(2)),
    };
  };

  findPriceByProductsIdAndMonth = async (
    tokenKeyData: ITokenKeyData,
    payload: CreateOrderRequestDto,
    coupon: ICouponVerifyEligibilityUser[]
  ): Promise<PlanPriceCrossSellOrder | null> => {
    const selectedProducts = payload.products ?? [];

    if (selectedProducts.length === 0) {
      return null;
    }

    const planPriceCrossSell =
      await this.productService.findPlanPriceProductCrossSell(
        tokenKeyData,
        payload.plan.plan_id,
        payload.months,
        selectedProducts
      );

    if (!planPriceCrossSell || planPriceCrossSell.length === 0) {
      return null;
    }

    let finalPrice = 0;

    planPriceCrossSell.forEach((item) => {
      let discountPercentage = item.price_discount;

      const findProduct = coupon.find(
        (itemProduct) => itemProduct.id_produto === item.product_id
      );

      if (findProduct) {
        discountPercentage =
          discountPercentage * findProduct.desconto_percentual;
      }

      finalPrice = finalPrice + discountPercentage;
    });

    return {
      product_id: null,
      price_discount: Number(finalPrice.toFixed(2)),
    };
  };

  findPriceByPlanIdAndMonth = async (
    payload: CreateOrderRequestDto,
    coupon: ICouponVerifyEligibilityUser[]
  ): Promise<PlanPrice | null> => {
    let finalPrice = 0;

    const planPrice = await this.planService.findPriceByPlanIdAndMonth(
      payload.plan.plan_id,
      payload.months
    );

    if (!planPrice || (!planPrice.price_with_discount && !planPrice.price)) {
      return null;
    }

    finalPrice = Number(planPrice.price_with_discount ?? planPrice.price);

    const selectedProducts = payload.plan.selected_products ?? [];

    if (selectedProducts.length === 0) {
      return this.couponService.applyDiscountCoupon(
        coupon,
        planPrice,
        payload,
        finalPrice
      );
    }

    const planPriceNotProducts =
      await this.planService.findPriceByPlanIdAndMonthNotProducts(
        payload.plan.plan_id,
        payload.months,
        selectedProducts
      );

    planPriceNotProducts.forEach((item) => {
      const discountPercentage = item.plan_percentage;

      finalPrice -= finalPrice * discountPercentage;
    });

    return this.couponService.applyDiscountCoupon(
      coupon,
      planPrice,
      payload,
      finalPrice
    );
  };

  totalPricesOrder = async (
    t: TFunction<"translation", undefined>,
    tokenKeyData: ITokenKeyData,
    tokenJwtData: ITokenJwtData,
    payload: CreateOrderRequestDto
  ): Promise<PlanPrice | null> => {
    const coupon = await this.couponService.applyAndValidateDiscountCoupon(
      t,
      tokenKeyData,
      tokenJwtData,
      payload
    );

    const [planPrice, planPriceCrossSell] = await Promise.all([
      this.findPriceByPlanIdAndMonth(payload, coupon),
      this.findPriceByProductsIdAndMonth(tokenKeyData, payload, coupon),
    ]);

    if (!planPrice) {
      return null;
    }

    if (!planPriceCrossSell) {
      return planPrice;
    }

    const finalPrice =
      Number(planPrice.price) + Number(planPriceCrossSell.price_discount);

    const finalPriceDiscount =
      Number(planPrice.price_with_discount) +
      Number(planPriceCrossSell.price_discount);

    const discountValue = finalPrice - finalPriceDiscount;
    const discountPercentage = (discountValue / finalPrice) * 100;

    return {
      months: planPrice.months,
      price: Number(finalPrice.toFixed(2)),
      discount_value: Number(discountValue.toFixed(2)),
      discount_percentage: Number(discountPercentage.toFixed(2)),
      price_with_discount: Number(finalPriceDiscount.toFixed(2)),
    };
  };
}
