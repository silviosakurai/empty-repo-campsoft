import { ITokenJwtData } from "@core/common/interfaces/ITokenJwtData";
import { ITokenKeyData } from "@core/common/interfaces/ITokenKeyData";
import { SignatureByClientIdViewer } from "@core/repositories/signature/SignatureByClientIdViewer.repository";
import { CancelProductSignatureRepository } from "@core/repositories/signature/CancelProductSignature.repository";
import { CancelSignatureRepository } from "@core/repositories/signature/CancelSignature.repository";
import { FindSignatureByOrderNumber } from "@core/repositories/signature/FindSignatureByOrder.repository";
import { injectable } from "tsyringe";
import { SignatureCreatorRepository } from "@core/repositories/signature/SignatureCreator.repository";
import { CreateOrderRequestDto } from "@core/useCases/order/dtos/CreateOrderRequest.dto";
import { SignaturePaidActiveRepository } from "@core/repositories/signature/SignaturePaidActive.repository";
import { SignatureUpgradedRepository } from "@core/repositories/signature/SignatureUpgraded.repository";
import {
  ISignatureActiveByClient,
  ISignatureByOrder,
} from "@core/interfaces/repositories/signature";
import { OrdersUpdaterRepository } from "@core/repositories/order/OrdersUpdater.repository";
import { OrderStatusEnum } from "@core/common/enums/models/order";
import { IVoucherProductsAndPlans } from "@core/interfaces/repositories/voucher";

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
    private readonly ordersUpdaterRepository: OrdersUpdaterRepository
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

  create = async (
    tokenKeyData: ITokenKeyData,
    tokenJwtData: ITokenJwtData,
    payload: CreateOrderRequestDto,
    orderId: string
  ) => {
    return this.signatureCreatorRepository.create(
      tokenKeyData,
      tokenJwtData,
      payload,
      orderId
    );
  };

  createSignatureProducts = async (
    products: string[],
    signatureId: string,
    findSignatureActiveByClientId: ISignatureActiveByClient[]
  ) => {
    return this.signatureCreatorRepository.createSignatureProducts(
      products,
      signatureId,
      findSignatureActiveByClientId
    );
  };

  activePaidSignature = async (
    orderNumber: string,
    previousOrderId: string | null = null,
    activateNow: boolean = true
  ) => {
    const signature =
      await this.findSignatureByOrderNumber.findByOrder(orderNumber);

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
      orderNumber,
      OrderStatusEnum.APPROVED
    );
  };

  activePaidSignatureWithVoucher = async (
    orderNumber: string,
    voucherProductsAndPlans: IVoucherProductsAndPlans
  ) => {
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
}
