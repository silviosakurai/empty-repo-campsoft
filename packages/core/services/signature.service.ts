import { ITokenJwtData } from "@core/common/interfaces/ITokenJwtData";
import { ITokenKeyData } from "@core/common/interfaces/ITokenKeyData";
import { SignatureByClientIdViewer } from "@core/repositories/signature/SignatureByClientIdViewer.repository";
import { CancelProductSignatureRepository } from "@core/repositories/signature/CancelProductSignature.repository";
import { CancelSignatureRepository } from "@core/repositories/signature/CancelSignature.repository";
import { FindSignatureByOrderNumber } from "@core/repositories/signature/FindSignatureByOrder.repository";
import { injectable } from "tsyringe";
import { SignatureCreatorRepository } from "@core/repositories/signature/SignatureCreator.repository";
import { SignaturePaidActiveRepository } from "@core/repositories/signature/SignaturePaidActive.repository";
import { SignatureUpgradedRepository } from "@core/repositories/signature/SignatureUpgraded.repository";
import {
  ISignatureActiveByClient,
  ISignatureByOrder,
} from "@core/interfaces/repositories/signature";
import { OrdersUpdaterRepository } from "@core/repositories/order/OrdersUpdater.repository";
import { OrderStatusEnum } from "@core/common/enums/models/order";
import { IVoucherProductsAndPlans } from "@core/interfaces/repositories/voucher";
import { SignatureActiveByClientIdListerRepository } from "@core/repositories/signature/SignatureActiveByClientIdLister.repository";
import { CartDocument } from "@core/interfaces/repositories/cart";
import { ListOrderById } from "@core/interfaces/repositories/order";
import OpenSearchService from "./openSearch.service";
import { OrderService } from "./order.service";
import { ProductListerByVoucherRepository } from "@core/repositories/product/ProductListerByVoucher.repository";
import { ClientSignatureRecorrencia } from "@core/common/enums/models/signature";

@injectable()
export class SignatureService {
  constructor(
    private readonly signatureViewerByClientId: SignatureByClientIdViewer,
    private readonly findSignatureByOrderNumber: FindSignatureByOrderNumber,
    private readonly cancelSignatureRepository: CancelSignatureRepository,
    private readonly cancelProductSignatureRepository: CancelProductSignatureRepository,
    private readonly signatureCreatorRepository: SignatureCreatorRepository,
    private readonly signaturePaidActiveRepository: SignaturePaidActiveRepository,
    private readonly signatureUpgradedRepository: SignatureUpgradedRepository,
    private readonly ordersUpdaterRepository: OrdersUpdaterRepository,
    private readonly signatureActiveByClientIdListerRepository: SignatureActiveByClientIdListerRepository,
    private readonly productListerByVoucherRepository: ProductListerByVoucherRepository,
    private readonly openSearchService: OpenSearchService,
    private readonly orderService: OrderService
  ) {}

  findByClientId = async (client_id: string) => {
    return this.signatureViewerByClientId.find(client_id);
  };

  findByOrderNumber = async (orderNumber: string) => {
    return this.findSignatureByOrderNumber.find(orderNumber);
  };

  cancelByOrderNumber = async (
    orderNumber: string,
    tokenKeyData: ITokenKeyData,
    tokenJwtData: ITokenJwtData
  ) => {
    return this.cancelSignatureRepository.cancel(
      orderNumber,
      tokenKeyData,
      tokenJwtData
    );
  };

  cancelProducts = async (
    signatureId: string,
    productCancelDate: string,
    productsIds: string[]
  ) => {
    return this.cancelProductSignatureRepository.cancel(
      signatureId,
      productCancelDate,
      productsIds
    );
  };

  activePaidSignature = async (
    orderId: string,
    previousOrderId: string | null = null,
    activateNow: boolean = true
  ) => {
    const order = await this.orderService.listOrderById(orderId);

    if (!order) {
      return false;
    }

    const signatureId = await this.createSignature(order);

    if (!signatureId) {
      return false;
    }

    const signature =
      await this.findSignatureByOrderNumber.findByOrder(orderId);

    if (!signature) {
      return false;
    }

    const previousOrder = await this.previousOrderUpgrade(
      previousOrderId,
      activateNow
    );

    const updateSignaturePaid =
      await this.signaturePaidActiveRepository.updateSignaturePaid(
        signature,
        previousOrder
      );

    if (!updateSignaturePaid) {
      return false;
    }

    await this.signaturePaidActiveRepository.updateSignatureProductsPaid(
      signature,
      previousOrder
    );

    return this.ordersUpdaterRepository.updateOrderStatus(
      orderId,
      OrderStatusEnum.APPROVED
    );
  };

  activePaidSignatureWithVoucher = async (
    orderNumber: string,
    voucherProductsAndPlans: IVoucherProductsAndPlans
  ) => {
    const order = await this.orderService.listOrderById(orderNumber);

    if (!order) {
      return false;
    }

    const signatureId = await this.createSignatureByVoucher(order);

    if (!signatureId) {
      return false;
    }

    const signature =
      await this.findSignatureByOrderNumber.findByOrder(orderNumber);

    if (!signature) {
      return false;
    }

    const updateSignaturePaid =
      await this.signaturePaidActiveRepository.updateSignaturePaidWithVoucher(
        signature,
        voucherProductsAndPlans
      );

    if (!updateSignaturePaid) {
      return false;
    }

    await this.signaturePaidActiveRepository.updateSignatureProductsPaidWithVoucher(
      signature,
      voucherProductsAndPlans
    );

    if (
      voucherProductsAndPlans.products &&
      voucherProductsAndPlans.products.length > 0
    ) {
      await this.signaturePaidActiveRepository.updateOrCreateSignatureProductsPaidWithVoucher(
        signature,
        voucherProductsAndPlans
      );
    }

    return this.ordersUpdaterRepository.updateOrderStatus(
      orderNumber,
      OrderStatusEnum.APPROVED
    );
  };

  private previousOrderUpgrade = async (
    previousOrderId: string | null = null,
    activateNow: boolean = true
  ): Promise<ISignatureByOrder | null> => {
    if (previousOrderId && !activateNow) {
      const previousSignature =
        await this.findSignatureByOrderNumber.findByOrder(previousOrderId);

      if (!previousSignature) {
        return null;
      }

      const upgradeSignature =
        await this.signatureUpgradedRepository.updateSignaturePrevious(
          previousSignature
        );

      if (!upgradeSignature) {
        return null;
      }

      const upgradeSignatureProducts =
        await this.signatureUpgradedRepository.updateSignatureProductsPrevious(
          previousSignature
        );

      if (!upgradeSignatureProducts) {
        return null;
      }

      return previousSignature;
    }

    return null;
  };

  findSignatureActiveByClientId = async (
    clientId: string,
    planId: number,
    productsIds: string[]
  ) => {
    return this.findSignatureByOrderNumber.findSignatureActiveByClientId(
      clientId,
      planId,
      productsIds
    );
  };

  isSignaturePlanActiveByClientId = async (
    clientId: string,
    planId: number
  ) => {
    return this.findSignatureByOrderNumber.isSignaturePlanActiveByClientId(
      clientId,
      planId
    );
  };

  findByOrder = async (orderNumber: string) => {
    return this.findSignatureByOrderNumber.findByOrder(orderNumber);
  };

  findActiveByClientId = async (clientId: string) => {
    return this.signatureActiveByClientIdListerRepository.find(clientId);
  };

  create = async (
    partnerId: number,
    clientId: string,
    cart: CartDocument,
    orderId: string
  ) => {
    return this.signatureCreatorRepository.create(
      partnerId,
      clientId,
      cart,
      orderId
    );
  };

  createByVoucher = async (
    partnerId: number,
    clientId: string,
    orderId: string,
    planId: number
  ) => {
    return this.signatureCreatorRepository.createByVoucher(
      partnerId,
      clientId,
      orderId,
      planId
    );
  };

  createSignatureProducts = async (signatureId: string, cart: CartDocument) => {
    return this.signatureCreatorRepository.createSignatureProducts(
      signatureId,
      cart
    );
  };

  createSignatureProductsByVoucher = async (
    signatureId: string,
    productsId: string[],
    signatureActive: ISignatureActiveByClient[]
  ) => {
    return this.signatureCreatorRepository.createSignatureProductsByVoucher(
      signatureId,
      productsId,
      signatureActive
    );
  };

  createSignature = async (order: ListOrderById): Promise<string | null> => {
    const cart = await this.openSearchService.getCart(order.cart_id);

    if (!cart) {
      return null;
    }

    const createSignature = await this.create(
      order.company_id,
      order.client_id,
      cart,
      order.order_id
    );

    if (!createSignature) {
      return null;
    }

    const createSignatureProducts = await this.createSignatureProducts(
      createSignature,
      cart
    );

    if (!createSignatureProducts) {
      return null;
    }

    return createSignature;
  };

  createSignatureByVoucher = async (
    order: ListOrderById
  ): Promise<string | null> => {
    const createSignature = await this.createByVoucher(
      order.company_id,
      order.client_id,
      order.order_id,
      order.plan_id
    );

    if (!createSignature) {
      return null;
    }

    const productsByVoucher = await this.productListerByVoucherRepository.list(
      order.company_id,
      order.voucher
    );

    if (!productsByVoucher) {
      return null;
    }

    let products = productsByVoucher.map((product) => product.product_id);

    const findSignatureActiveByClientId =
      await this.findSignatureActiveByClientId(
        order.client_id,
        order.plan_id,
        products
      );

    if (!findSignatureActiveByClientId) {
      return null;
    }

    if (findSignatureActiveByClientId.length > 0) {
      const idsProductsToRemove = findSignatureActiveByClientId
        .filter(
          (signature) => signature.recurrence === ClientSignatureRecorrencia.YES
        )
        .map((signature) => signature.product_id);

      products = products.filter(
        (product) => !idsProductsToRemove.includes(product)
      );
    }

    const createSignatureProducts = await this.createSignatureProductsByVoucher(
      createSignature,
      products,
      findSignatureActiveByClientId
    );

    if (!createSignatureProducts) {
      return null;
    }

    return createSignature;
  };
}
