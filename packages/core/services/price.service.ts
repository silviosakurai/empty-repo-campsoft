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
import { OrderService } from "./order.service";
import { ISignatureActiveByClient } from "@core/interfaces/repositories/signature";
import { ClientSignatureRecorrencia } from "@core/common/enums/models/signature";
import { CreateCartRequest } from "@core/useCases/cart/dtos/CreateCartRequest.dto";

@injectable()
export class PriceService {
  constructor(
    private readonly productService: ProductService,
    private readonly couponService: CouponService,
    private readonly planService: PlanService,
    private readonly orderService: OrderService
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
    payload: CreateCartRequest,
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
        payload.months ?? 0,
        selectedProducts
      );

    if (!planPriceCrossSell || planPriceCrossSell.length === 0) {
      return null;
    }

    let finalPrice = 0;
    let discountCoupon = 0;

    planPriceCrossSell.forEach((item) => {
      let discountPercentage = item.price_discount;

      const findProduct = coupon.find(
        (itemProduct) => itemProduct.id_produto === item.product_id
      );

      if (findProduct) {
        const discountValue =
          discountPercentage * findProduct.desconto_percentual;

        discountPercentage -= discountValue;
        discountCoupon += discountValue;
      }

      finalPrice = finalPrice + discountPercentage;
    });

    return {
      product_id: null,
      price_discount: Number(finalPrice.toFixed(2)),
      discount_coupon: Number(discountCoupon.toFixed(2)),
    };
  };

  findPriceByPlanIdAndMonth = async (
    payload: CreateCartRequest,
    coupon: ICouponVerifyEligibilityUser[]
  ): Promise<PlanPrice | null> => {
    let finalPrice = 0;

    const planPrice = await this.planService.findPriceByPlanIdAndMonth(
      payload.plan.plan_id,
      payload.months ?? 0
    );

    if (!planPrice || (!planPrice.price_with_discount && !planPrice.price)) {
      return null;
    }

    finalPrice = Number(planPrice.price_with_discount ?? planPrice.price);

    return this.couponService.applyDiscountCoupon(
      coupon,
      planPrice,
      payload,
      finalPrice
    );
  };

  applyDiscountPreviousOrderByActivateNow = async (
    payload: CreateCartRequest
  ): Promise<number> => {
    if (payload?.activate_now && payload?.previous_order_id) {
      const orderPrevious = await this.orderService.listOrderById(
        payload.previous_order_id
      );

      if (!orderPrevious) {
        return 0;
      }

      return (
        orderPrevious.total_price_with_discount ?? orderPrevious.total_price
      );
    }

    return 0;
  };

  totalPricesOrder = async (
    t: TFunction<"translation", undefined>,
    tokenKeyData: ITokenKeyData,
    tokenJwtData: ITokenJwtData,
    payload: CreateCartRequest,
    findSignatureActiveByClientId: ISignatureActiveByClient[]
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

    return this.applyDiscountPrice(
      planPrice,
      planPriceCrossSell,
      payload,
      findSignatureActiveByClientId
    );
  };

  private applyDiscountPrice = async (
    planPrice: PlanPrice,
    planPriceCrossSell: PlanPriceCrossSellOrder | null,
    payload: CreateCartRequest,
    findSignatureActiveByClientId: ISignatureActiveByClient[]
  ) => {
    const finalPrice = Number(planPrice.price);
    const discountCoupon =
      Number(planPrice?.discount_coupon ?? 0) +
      Number(planPriceCrossSell?.discount_coupon ?? 0);

    let discountProduct = 0;

    let finalPriceDiscount = Number(planPrice.price_with_discount);
    if (planPriceCrossSell) {
      finalPriceDiscount =
        finalPriceDiscount + Number(planPriceCrossSell.price_discount);
    }

    if (findSignatureActiveByClientId.length) {
      findSignatureActiveByClientId.forEach((item) => {
        if (item.recurrence === ClientSignatureRecorrencia.YES) {
          const discountValue = finalPriceDiscount * item.discount_percentage;

          finalPriceDiscount -= discountValue;
          discountProduct += discountValue;
        }
      });
    }

    let finalPriceDiscountOrderPrevious = 0;
    if (payload?.activate_now && payload.previous_order_id) {
      const priceDiscountOrderPrevious =
        await this.applyDiscountPreviousOrderByActivateNow(payload);

      finalPriceDiscountOrderPrevious =
        finalPriceDiscount - priceDiscountOrderPrevious;
    }

    const discountValue = finalPrice - finalPriceDiscount;
    const discountPercentage = (discountValue / finalPrice) * 100;

    return {
      months: planPrice.months,
      price: Number(finalPrice.toFixed(2)),
      discount_value: Number(discountValue.toFixed(2)),
      discount_percentage: Number(discountPercentage.toFixed(2)),
      price_with_discount: Math.max(0, Number(finalPriceDiscount.toFixed(2))),
      price_with_discount_order_previous: Math.max(
        0,
        Number(finalPriceDiscountOrderPrevious.toFixed(2))
      ),
      discount_coupon: Math.max(0, Number(discountCoupon.toFixed(2))),
      discount_product: Math.max(0, Number(discountProduct.toFixed(2))),
    };
  };
}
