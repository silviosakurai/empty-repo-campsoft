import { injectable } from "tsyringe";
import { VoucherService } from "./voucher.service";
import { ITokenKeyData } from "@core/common/interfaces/ITokenKeyData";
import { TFunction } from "i18next";
import { ITokenJwtData } from "@core/common/interfaces/ITokenJwtData";
import { FindSignatureByOrderNumber } from "@core/repositories/signature/FindSignatureByOrder.repository";
import { IVoucherProductsAndPlans } from "@core/interfaces/repositories/voucher";
import {
  ISignatureByOrder,
  ISignatureFindByClientId,
} from "@core/interfaces/repositories/signature";
import { ProductVoucherStatus } from "@core/common/enums/models/product";
import { Payment } from "@core/useCases/order/dtos/CreateOrderRequest.dto";
import { SignatureService } from "./signature.service";
import { OrderService } from "./order.service";

@injectable()
export class PaymentService {
  constructor(
    private readonly voucherService: VoucherService,
    private readonly findSignatureByOrderNumber: FindSignatureByOrderNumber,
    private readonly signatureService: SignatureService,
    private readonly orderService: OrderService
  ) {}

  private voucherIsValid = async (
    t: TFunction<"translation", undefined>,
    tokenKeyData: ITokenKeyData,
    tokenJwtData: ITokenJwtData,
    voucher: string
  ): Promise<boolean> => {
    const isEligibility = await this.voucherService.verifyEligibilityUser(
      tokenKeyData,
      voucher
    );

    if (!isEligibility) {
      throw new Error(t("voucher_not_eligible"));
    }

    const isRedemption = await this.voucherService.verifyRedemptionUser(
      tokenKeyData,
      tokenJwtData,
      isEligibility,
      voucher
    );

    if (!isRedemption) {
      throw new Error(t("voucher_not_redeemable"));
    }

    return true;
  };

  private voucherProductsAndPlans = async (
    tokenKeyData: ITokenKeyData,
    tokenJwtData: ITokenJwtData,
    voucher: string
  ): Promise<IVoucherProductsAndPlans> => {
    const isClientSignatureActive =
      await this.voucherService.isClientSignatureActive(tokenJwtData);

    const [listProductsUserResult, listPlansUserResult] = await Promise.all([
      this.voucherService.listVoucherEligibleProductsUser(
        tokenKeyData,
        tokenJwtData,
        voucher,
        isClientSignatureActive
      ),
      this.voucherService.listVoucherEligiblePlansUser(
        tokenKeyData,
        tokenJwtData,
        voucher,
        isClientSignatureActive
      ),
    ]);

    const listProductsUser = listProductsUserResult?.filter(
      (product) =>
        product.status === ProductVoucherStatus.IN_ADDITION ||
        product.status === ProductVoucherStatus.ACTIVE
    );

    const listPlansUser = listPlansUserResult?.filter(
      (plan) =>
        plan.status === ProductVoucherStatus.IN_ADDITION ||
        plan.status === ProductVoucherStatus.ACTIVE
    );

    return {
      products: listProductsUser ?? [],
      plans: listPlansUser ?? [],
    };
  };

  validateProductsAndPlansByVoucher = (
    t: TFunction<"translation", undefined>,
    voucherProductsAndPlans: IVoucherProductsAndPlans,
    signature: ISignatureByOrder,
    products: ISignatureFindByClientId[]
  ): boolean => {
    if (!voucherProductsAndPlans?.plans) {
      throw new Error(t("voucher_products_and_plans_not_found"));
    }

    const planIds = voucherProductsAndPlans.plans?.map((plan) => plan.plan_id);

    if (!planIds || planIds.length === 0) {
      throw new Error(t("voucher_plan_ids_not_found"));
    }

    if (!planIds.includes(signature.plan_id)) {
      throw new Error(t("voucher_plan_not_eligible"));
    }

    if (products) {
      if (!voucherProductsAndPlans?.products) {
        throw new Error(t("voucher_products_not_found"));
      }

      const productIds = voucherProductsAndPlans.products?.map(
        (product) => product.product_id
      );

      if (!productIds || productIds.length === 0) {
        throw new Error(t("voucher_product_ids_not_found"));
      }

      const isProductEligible = products.every((product) =>
        productIds.includes(product.product_id)
      );

      if (!isProductEligible) {
        throw new Error(t("voucher_product_not_eligible"));
      }
    }

    return true;
  };

  payWithVoucher = async (
    t: TFunction<"translation", undefined>,
    tokenKeyData: ITokenKeyData,
    tokenJwtData: ITokenJwtData,
    orderId: string,
    voucher: string
  ) => {
    await this.voucherIsValid(t, tokenKeyData, tokenJwtData, voucher);

    const order = await this.orderService.listOrderById(orderId);

    if (!order) {
      throw new Error(t("order_not_found"));
    }

    const signature =
      await this.findSignatureByOrderNumber.findByOrder(orderId);

    if (!signature) {
      throw new Error(t("signature_not_found"));
    }

    const voucherProductsAndPlans = await this.voucherProductsAndPlans(
      tokenKeyData,
      tokenJwtData,
      voucher
    );

    const findProductsBySignatureNotPlan =
      await this.findSignatureByOrderNumber.findProductsBySignatureNotPlan(
        signature.client_id,
        signature.signature_id,
        signature.plan_id
      );

    if (!findProductsBySignatureNotPlan) {
      throw new Error(t("products_not_found"));
    }

    this.validateProductsAndPlansByVoucher(
      t,
      voucherProductsAndPlans,
      signature,
      findProductsBySignatureNotPlan
    );

    await this.signatureService.activePaidSignature(
      order.order_id,
      order.order_id_previous,
      order.activation_immediate
    );
  };

  payWithCard = async (
    t: TFunction<"translation", undefined>,
    tokenKeyData: ITokenKeyData,
    tokenJwtData: ITokenJwtData,
    orderId: string,
    payment: Payment | null
  ) => {
    const order = await this.orderService.listOrderById(orderId);

    if (!order) {
      throw new Error(t("order_not_found"));
    }

    await this.signatureService.activePaidSignature(
      order.order_id,
      order.order_id_previous,
      order.activation_immediate
    );
  };
}
