import { VoucherEligibilityVerifierRepository } from "@core/repositories/voucher/VoucherEligibilityVerifier.repository";
import { CustomerVoucherRedemptionVerifierRepository } from "@core/repositories/voucher/CustomerVoucherRedemptionVerifier.repository";
import { AvailableVoucherProductsRepository } from "@core/repositories/voucher/AvailableVoucherProducts.repository";
import { ClientSignatureRepository } from "@core/repositories/signature/ClientSignature.repository";
import { AvailableVoucherPlansRepository } from "@core/repositories/voucher/AvailableVoucherPlans.repository";
import { injectable } from "tsyringe";
import { ITokenJwtData } from "@core/common/interfaces/ITokenJwtData";
import { IVerifyEligibilityUser } from "@core/interfaces/repositories/voucher";
import { ITokenKeyData } from "@core/common/interfaces/ITokenKeyData";

@injectable()
export class VoucherService {
  constructor(
    private readonly voucherEligibilityVerifierRepository: VoucherEligibilityVerifierRepository,
    private readonly customerVoucherRedemptionVerifierRepository: CustomerVoucherRedemptionVerifierRepository,
    private readonly availableVoucherProductsRepository: AvailableVoucherProductsRepository,
    private readonly clientSignatureRepository: ClientSignatureRepository,
    private readonly availableVoucherPlansRepository: AvailableVoucherPlansRepository
  ) {}

  verifyEligibilityUser = async (
    tokenKeyData: ITokenKeyData,
    voucher: string
  ) => {
    return await this.voucherEligibilityVerifierRepository.verifyEligibilityUser(
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
    return await this.customerVoucherRedemptionVerifierRepository.verifyRedemptionUser(
      tokenKeyData,
      tokenJwtData,
      isEligibility,
      voucher
    );
  };

  isClientSignatureActive = async (tokenJwtData: ITokenJwtData) => {
    return await this.clientSignatureRepository.isClientSignatureActive(
      tokenJwtData
    );
  };

  listVoucherEligibleProductsUser = async (
    tokenKeyData: ITokenKeyData,
    tokenJwtData: ITokenJwtData,
    voucher: string,
    isClientSignatureActive: boolean
  ) => {
    if (isClientSignatureActive) {
      return await this.availableVoucherProductsRepository.listVoucherEligibleProductsSignatureUser(
        tokenKeyData,
        tokenJwtData,
        voucher
      );
    }

    return await this.listVoucherEligibleProductsNotSignatureUser(
      tokenKeyData,
      voucher
    );
  };

  listVoucherEligibleProductsNotSignatureUser = async (
    tokenKeyData: ITokenKeyData,
    voucher: string
  ) => {
    return await this.availableVoucherProductsRepository.listVoucherEligibleProductsNotSignatureUser(
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
      return await this.availableVoucherPlansRepository.listVoucherEligiblePlansSignatureUser(
        tokenKeyData,
        tokenJwtData,
        voucher
      );
    }

    return await this.listVoucherEligiblePlansNotSignatureUser(
      tokenKeyData,
      voucher
    );
  };

  listVoucherEligiblePlansNotSignatureUser = async (
    tokenKeyData: ITokenKeyData,
    voucher: string
  ) => {
    return await this.availableVoucherPlansRepository.listVoucherEligiblePlansNotSignatureUser(
      tokenKeyData,
      voucher
    );
  };
}
