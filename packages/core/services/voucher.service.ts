import { VerifyVoucherEligibilityRepository } from "@core/repositories/voucher/VerifyVoucherEligibility.repository";
import { VerifyCustomerVoucherRedemptionRepository } from "@core/repositories/voucher/VerifyCustomerVoucherRedemption.repository";
import { AvailableVoucherProductsRepository } from "@core/repositories/voucher/AvailableVoucherProducts.repository";
import { injectable } from "tsyringe";
import { ITokenJwtData } from "@core/common/interfaces/ITokenJwtData";
import { IVerifyEligibilityUser } from "@core/interfaces/repositories/voucher";
import { ITokenKeyData } from "@core/common/interfaces/ITokenKeyData";

@injectable()
export class VoucherService {
  private verifyVoucherEligibilityRepository: VerifyVoucherEligibilityRepository;
  private verifyCustomerVoucherRedemptionRepository: VerifyCustomerVoucherRedemptionRepository;
  private availableVoucherProductsRepository: AvailableVoucherProductsRepository;

  constructor(
    verifyVoucherEligibilityRepository: VerifyVoucherEligibilityRepository,
    verifyCustomerVoucherRedemptionRepository: VerifyCustomerVoucherRedemptionRepository,
    availableVoucherProductsRepository: AvailableVoucherProductsRepository
  ) {
    this.verifyVoucherEligibilityRepository =
      verifyVoucherEligibilityRepository;
    this.verifyCustomerVoucherRedemptionRepository =
      verifyCustomerVoucherRedemptionRepository;
    this.availableVoucherProductsRepository =
      availableVoucherProductsRepository;
  }

  verifyEligibilityUser = async (
    tokenKeyData: ITokenKeyData,
    voucher: string
  ) => {
    try {
      return await this.verifyVoucherEligibilityRepository.verifyEligibilityUser(
        tokenKeyData,
        voucher
      );
    } catch (error) {
      throw error;
    }
  };

  verifyRedemptionUser = async (
    tokenKeyData: ITokenKeyData,
    tokenJwtData: ITokenJwtData,
    isEligibility: IVerifyEligibilityUser,
    voucher: string
  ) => {
    try {
      return await this.verifyCustomerVoucherRedemptionRepository.verifyRedemptionUser(
        tokenKeyData,
        tokenJwtData,
        isEligibility,
        voucher
      );
    } catch (error) {
      throw error;
    }
  };

  listVoucherEligibleProductsUser = async (
    tokenKeyData: ITokenKeyData,
    tokenJwtData: ITokenJwtData,
    voucher: string
  ) => {
    try {
      const isClientSignatureActive =
        await this.availableVoucherProductsRepository.isClientSignatureActive(
          tokenJwtData
        );

      if (isClientSignatureActive) {
        return await this.availableVoucherProductsRepository.listVoucherEligibleProductsSignatureUser(
          tokenKeyData,
          tokenJwtData,
          voucher
        );
      }

      return await this.availableVoucherProductsRepository.listVoucherEligibleProductsNotSignatureUser(
        tokenKeyData,
        voucher
      );
    } catch (error) {
      throw error;
    }
  };
}
