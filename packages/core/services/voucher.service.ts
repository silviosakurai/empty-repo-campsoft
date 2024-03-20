import { VerifyVoucherEligibilityRepository } from "@core/repositories/voucher/VerifyVoucherEligibility.repository";
import { VerifyCustomerVoucherRedemptionRepository } from "@core/repositories/voucher/VerifyCustomerVoucherRedemption.repository";
import { injectable } from "tsyringe";
import { ITokenJwtData } from "@core/common/interfaces/ITokenJwtData";
import { IVerifyEligibilityUser } from "@core/interfaces/repositories/voucher";

@injectable()
export class VoucherService {
  private verifyVoucherEligibilityRepository: VerifyVoucherEligibilityRepository;
  private verifyCustomerVoucherRedemptionRepository: VerifyCustomerVoucherRedemptionRepository;

  constructor(
    verifyVoucherEligibilityRepository: VerifyVoucherEligibilityRepository,
    verifyCustomerVoucherRedemptionRepository: VerifyCustomerVoucherRedemptionRepository
  ) {
    this.verifyVoucherEligibilityRepository =
      verifyVoucherEligibilityRepository;
    this.verifyCustomerVoucherRedemptionRepository =
      verifyCustomerVoucherRedemptionRepository;
  }

  verifyEligibilityUser = async (voucher: string) => {
    try {
      return await this.verifyVoucherEligibilityRepository.verifyEligibilityUser(
        voucher
      );
    } catch (error) {
      throw error;
    }
  };

  verifyRedemptionUser = async (
    tokenJwtData: ITokenJwtData,
    isEligibility: IVerifyEligibilityUser,
    voucher: string
  ) => {
    try {
      return await this.verifyCustomerVoucherRedemptionRepository.verifyRedemptionUser(
        tokenJwtData,
        isEligibility,
        voucher
      );
    } catch (error) {
      throw error;
    }
  };
}
