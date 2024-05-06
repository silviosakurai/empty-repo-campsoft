import { VoucherEligibilityVerifierRepository } from "@core/repositories/voucher/VoucherEligibilityVerifier.repository";
import { CustomerVoucherRedemptionVerifierRepository } from "@core/repositories/voucher/CustomerVoucherRedemptionVerifier.repository";
import { AvailableVoucherProductsRepository } from "@core/repositories/voucher/AvailableVoucherProducts.repository";
import { ClientSignatureRepository } from "@core/repositories/signature/ClientSignature.repository";
import { AvailableVoucherPlansRepository } from "@core/repositories/voucher/AvailableVoucherPlans.repository";
import { injectable } from "tsyringe";
import { ITokenJwtData } from "@core/common/interfaces/ITokenJwtData";
import { IVerifyEligibilityUser } from "@core/interfaces/repositories/voucher";
import { ITokenKeyData } from "@core/common/interfaces/ITokenKeyData";
import { VoucherUpdaterRepository } from "@core/repositories/voucher/VoucherUpdater.repository";
import { VoucherDetailsRepository } from "@core/repositories/voucher/voucherDetails.repository";

@injectable()
export class VoucherService {
  constructor(
    private readonly voucherEligibilityVerifierRepository: VoucherEligibilityVerifierRepository,
    private readonly customerVoucherRedemptionVerifierRepository: CustomerVoucherRedemptionVerifierRepository,
    private readonly availableVoucherProductsRepository: AvailableVoucherProductsRepository,
    private readonly clientSignatureRepository: ClientSignatureRepository,
    private readonly availableVoucherPlansRepository: AvailableVoucherPlansRepository,
    private readonly voucherUpdaterRepository: VoucherUpdaterRepository,
    private readonly voucherDetailsRepository: VoucherDetailsRepository
  ) {}

  verifyEligibilityUser = async (
    tokenKeyData: ITokenKeyData,
    voucher: string
  ) => {
    return this.voucherEligibilityVerifierRepository.verifyEligibilityUser(
      tokenKeyData,
      voucher
    );
  };

  verifyRedemptionUser = async (
    tokenKeyData: ITokenKeyData,
    tokenJwtData: ITokenJwtData,
    isEligibility: IVerifyEligibilityUser,
    voucher: string
  ) => {
    return this.customerVoucherRedemptionVerifierRepository.verifyRedemptionUser(
      tokenKeyData,
      tokenJwtData,
      isEligibility,
      voucher
    );
  };

  isClientSignatureActive = async (tokenJwtData: ITokenJwtData) => {
    return this.clientSignatureRepository.isClientSignatureActive(tokenJwtData);
  };

  listVoucherEligibleProductsUser = async (
    tokenKeyData: ITokenKeyData,
    tokenJwtData: ITokenJwtData,
    voucher: string,
    isClientSignatureActive: boolean
  ) => {
    if (isClientSignatureActive) {
      return this.availableVoucherProductsRepository.listVoucherEligibleProductsSignatureUser(
        tokenKeyData,
        tokenJwtData,
        voucher
      );
    }

    return this.listVoucherEligibleProductsNotSignatureUser(
      tokenKeyData,
      voucher
    );
  };

  listVoucherEligibleProductsNotSignatureUser = async (
    tokenKeyData: ITokenKeyData,
    voucher: string
  ) => {
    return this.availableVoucherProductsRepository.listVoucherEligibleProductsNotSignatureUser(
      tokenKeyData,
      voucher
    );
  };

  listVoucherEligiblePlansUser = async (
    tokenKeyData: ITokenKeyData,
    tokenJwtData: ITokenJwtData,
    voucher: string,
    isClientSignatureActive: boolean
  ) => {
    if (isClientSignatureActive) {
      return this.availableVoucherPlansRepository.listVoucherEligiblePlansSignatureUser(
        tokenKeyData,
        tokenJwtData,
        voucher
      );
    }

    return this.listVoucherEligiblePlansNotSignatureUser(tokenKeyData, voucher);
  };

  listVoucherEligiblePlansNotSignatureUser = async (
    tokenKeyData: ITokenKeyData,
    voucher: string
  ) => {
    return this.availableVoucherPlansRepository.listVoucherEligiblePlansNotSignatureUser(
      tokenKeyData,
      voucher
    );
  };

  isProductsVoucherEligible = async (
    tokenKeyData: ITokenKeyData,
    voucher: string | null | undefined,
    selectedProducts: string[] | null | undefined
  ) => {
    return this.voucherEligibilityVerifierRepository.isProductsVoucherEligible(
      tokenKeyData,
      voucher,
      selectedProducts
    );
  };

  updateVoucher = async (voucher: string) => {
    return this.voucherUpdaterRepository.updateVoucher(voucher);
  };

  getVoucherDetails = async (tokenKeyData: ITokenKeyData, voucher: string) => {
    return this.voucherDetailsRepository.getVoucherDetails(
      tokenKeyData,
      voucher
    );
  };
}
