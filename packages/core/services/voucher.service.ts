import { VerifyVoucherEligibilityRepository } from "@core/repositories/voucher/VerifyVoucherEligibility.repository";
import { VerifyCustomerVoucherRedemptionRepository } from "@core/repositories/voucher/VerifyCustomerVoucherRedemption.repository";
import { AvailableVoucherProductsRepository } from "@core/repositories/voucher/AvailableVoucherProducts.repository";
import { ClientSignatureRepository } from "@core/repositories/signature/ClientSignature.repository";
import { AvailableVoucherPlansRepository } from "@core/repositories/voucher/AvailableVoucherPlans.repository";
import { injectable } from "tsyringe";
import { ITokenJwtData } from "@core/common/interfaces/ITokenJwtData";
import { IVerifyEligibilityUser } from "@core/interfaces/repositories/voucher";
import { ITokenKeyData } from "@core/common/interfaces/ITokenKeyData";

@injectable()
export class VoucherService {
  private verifyVoucherEligibilityRepository: VerifyVoucherEligibilityRepository;
  private verifyCustomerVoucherRedemptionRepository: VerifyCustomerVoucherRedemptionRepository;
  private availableVoucherProductsRepository: AvailableVoucherProductsRepository;
  private clientSignatureRepository: ClientSignatureRepository;
  private availableVoucherPlansRepository: AvailableVoucherPlansRepository;

  constructor(
    verifyVoucherEligibilityRepository: VerifyVoucherEligibilityRepository,
    verifyCustomerVoucherRedemptionRepository: VerifyCustomerVoucherRedemptionRepository,
    availableVoucherProductsRepository: AvailableVoucherProductsRepository,
    clientSignatureRepository: ClientSignatureRepository,
    availableVoucherPlansRepository: AvailableVoucherPlansRepository
  ) {
    this.verifyVoucherEligibilityRepository =
      verifyVoucherEligibilityRepository;
    this.verifyCustomerVoucherRedemptionRepository =
      verifyCustomerVoucherRedemptionRepository;
    this.availableVoucherProductsRepository =
      availableVoucherProductsRepository;
    this.clientSignatureRepository = clientSignatureRepository;
    this.availableVoucherPlansRepository = availableVoucherPlansRepository;
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

  isClientSignatureActive = async (tokenJwtData: ITokenJwtData) => {
    try {
      return await this.clientSignatureRepository.isClientSignatureActive(
        tokenJwtData
      );
    } catch (error) {
      throw error;
    }
  };

  listVoucherEligibleProductsUser = async (
    tokenKeyData: ITokenKeyData,
    tokenJwtData: ITokenJwtData,
    voucher: string,
    isClientSignatureActive: boolean
  ) => {
    try {
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
    } catch (error) {
      throw error;
    }
  };

  listVoucherEligibleProductsNotSignatureUser = async (
    tokenKeyData: ITokenKeyData,
    voucher: string
  ) => {
    try {
      return await this.availableVoucherProductsRepository.listVoucherEligibleProductsNotSignatureUser(
        tokenKeyData,
        voucher
      );
    } catch (error) {
      throw error;
    }
  };

  listVoucherEligiblePlansUser = async (
    tokenKeyData: ITokenKeyData,
    tokenJwtData: ITokenJwtData,
    voucher: string,
    isClientSignatureActive: boolean
  ) => {
    try {
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
    } catch (error) {
      throw error;
    }
  };

  listVoucherEligiblePlansNotSignatureUser = async (
    tokenKeyData: ITokenKeyData,
    voucher: string
  ) => {
    try {
      return await this.availableVoucherPlansRepository.listVoucherEligiblePlansNotSignatureUser(
        tokenKeyData,
        voucher
      );
    } catch (error) {
      throw error;
    }
  };
}
