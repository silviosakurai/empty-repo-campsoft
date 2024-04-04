import { injectable } from "tsyringe";
import { OrderService } from "@core/services/order.service";
import { PlanService } from "@core/services/plan.service";
import { ITokenKeyData } from "@core/common/interfaces/ITokenKeyData";
import { ITokenJwtData } from "@core/common/interfaces/ITokenJwtData";
import { CreateOrderRequestDto } from "@core/useCases/order/dtos/CreateOrderRequest.dto";
import { t, TFunction } from "i18next";
import { ClientService, ProductService } from "@core/services";
import { PlanPrice } from "@core/common/enums/models/plan";
import { PlanPriceCrossSellOrder } from "@core/interfaces/repositories/plan";
import { OrderCreatePaymentsCard } from "@core/interfaces/repositories/order";
import { CouponService } from "@core/services/coupon.service";
import { ICouponVerifyEligibilityUser } from "@core/interfaces/repositories/coupon";

@injectable()
export class CreateOrderUseCase {
  constructor(
    private readonly orderService: OrderService,
    private readonly planService: PlanService,
    private readonly productService: ProductService,
    private readonly clientService: ClientService,
    private readonly couponService: CouponService
  ) {}

  async execute(
    t: TFunction<"translation", undefined>,
    tokenKeyData: ITokenKeyData,
    tokenJwtData: ITokenJwtData,
    payload: CreateOrderRequestDto
  ) {
    const userFounded = await this.clientService.view(
      tokenKeyData,
      tokenJwtData.clientId
    );

    if (!userFounded) {
      throw new Error(t("client_not_found"));
    }

    const [isPlanProductAndProductGroups, isPlanProductCrossSell] =
      await Promise.all([
        this.isPlanProductAndProductGroups(tokenKeyData, payload),
        this.isPlanProductCrossSell(tokenKeyData, payload),
      ]);

    if (!isPlanProductCrossSell || !isPlanProductAndProductGroups) {
      throw new Error(t("product_not_eligible_for_plan"));
    }

    const totalPrices = await this.totalPricesOrder(
      t,
      tokenKeyData,
      tokenJwtData,
      payload
    );

    if (!totalPrices) {
      throw new Error(t("plan_price_not_found"));
    }

    const totalPricesInstallments = this.calculatePriceInstallments(
      payload,
      totalPrices
    );

    if (!totalPricesInstallments) {
      throw new Error(t("installments_not_calculated"));
    }

    const order = await this.orderService.create(
      tokenKeyData,
      tokenJwtData,
      payload,
      totalPrices,
      userFounded,
      totalPricesInstallments
    );

    if (!order) {
      return null;
    }

    return order;
  }

  private async totalPricesOrder(
    t: TFunction<"translation", undefined>,
    tokenKeyData: ITokenKeyData,
    tokenJwtData: ITokenJwtData,
    payload: CreateOrderRequestDto
  ): Promise<PlanPrice | null> {
    const coupon = await this.applyAndValidateDiscountCoupon(
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
  }

  private async findPriceByProductsIdAndMonth(
    tokenKeyData: ITokenKeyData,
    payload: CreateOrderRequestDto,
    coupon: ICouponVerifyEligibilityUser[]
  ): Promise<PlanPriceCrossSellOrder | null> {
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
  }

  private async findPriceByPlanIdAndMonth(
    payload: CreateOrderRequestDto,
    coupon: ICouponVerifyEligibilityUser[]
  ): Promise<PlanPrice | null> {
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
      return this.applyDiscountCoupon(coupon, planPrice, payload, finalPrice);
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

    return this.applyDiscountCoupon(coupon, planPrice, payload, finalPrice);
  }

  private async isPlanProductAndProductGroups(
    tokenKeyData: ITokenKeyData,
    payload: CreateOrderRequestDto
  ): Promise<boolean> {
    const selectedProducts = payload.plan.selected_products ?? [];

    if (selectedProducts.length === 0) {
      return true;
    }

    const planProductAndProductGroups =
      await this.planService.findPlanProductAndProductGroups(
        tokenKeyData,
        payload.plan.plan_id,
        selectedProducts
      );

    if (
      !planProductAndProductGroups ||
      planProductAndProductGroups.length === 0
    ) {
      return false;
    }

    const productIds = planProductAndProductGroups.map((item) =>
      item.product_id.toString()
    );

    const allProductsSelected = selectedProducts.every((selected) =>
      productIds.includes(selected.toString())
    );

    return allProductsSelected;
  }

  private async isPlanProductCrossSell(
    tokenKeyData: ITokenKeyData,
    payload: CreateOrderRequestDto
  ): Promise<boolean> {
    const selectedProducts = payload.products ?? [];

    if (selectedProducts.length === 0) {
      return true;
    }

    const planProductCrossSell =
      await this.productService.findPlanProductCrossSell(
        tokenKeyData,
        payload.plan.plan_id,
        payload.months,
        selectedProducts
      );

    if (!planProductCrossSell || planProductCrossSell.length === 0) {
      return false;
    }

    const productIds = planProductCrossSell.map((item) =>
      item.product_id.toString()
    );

    const allProductsSelected = selectedProducts.every((selected) =>
      productIds.includes(selected.toString())
    );

    return allProductsSelected;
  }

  private async applyAndValidateDiscountCoupon(
    t: TFunction<"translation", undefined>,
    tokenKeyData: ITokenKeyData,
    tokenJwtData: ITokenJwtData,
    payload: CreateOrderRequestDto
  ): Promise<ICouponVerifyEligibilityUser[]> {
    if (!payload.coupon_code) {
      return [] as ICouponVerifyEligibilityUser[];
    }

    const isEligibility = await this.couponService.verifyEligibilityCoupon(
      tokenKeyData,
      payload.coupon_code,
      payload.plan.plan_id,
      payload.products
    );

    if (!isEligibility || isEligibility.length === 0) {
      throw new Error(t("coupon_not_eligible"));
    }

    const isRedemption = await this.couponService.verifyRedemptionCouponByUser(
      tokenKeyData,
      tokenJwtData,
      isEligibility,
      payload.coupon_code
    );

    if (!isRedemption) {
      throw new Error(t("coupon_not_redeemable"));
    }

    return isEligibility;
  }

  private calculatePriceInstallments(
    payload: CreateOrderRequestDto,
    totalPrices: PlanPrice
  ): OrderCreatePaymentsCard | null {
    const installments = payload.payment?.credit_card?.installments ?? 1;

    const price = Number(totalPrices.price_with_discount);
    const priceInstallments = price / installments;

    return {
      installments,
      value: Number(priceInstallments.toFixed(2)),
    };
  }

  private applyDiscountCoupon(
    coupon: ICouponVerifyEligibilityUser[],
    planPrice: PlanPrice,
    payload: CreateOrderRequestDto,
    finalPrice: number
  ): PlanPrice {
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
  }
}
