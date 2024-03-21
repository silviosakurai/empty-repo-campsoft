import { injectable } from "tsyringe";
import { VoucherService } from "@core/services/voucher.service";
import { TFunction } from "i18next";
import { VoucherError } from "@core/common/exceptions/VoucherError";
import { ITokenJwtData } from "@core/common/interfaces/ITokenJwtData";
import { ITokenKeyData } from "@core/common/interfaces/ITokenKeyData";

@injectable()
export class VoucherViewUserUseCase {
  private voucherService: VoucherService;

  constructor(voucherService: VoucherService) {
    this.voucherService = voucherService;
  }

  view = async (
    t: TFunction<"translation", undefined>,
    tokenKeyData: ITokenKeyData,
    tokenJwtData: ITokenJwtData,
    voucher: string
  ) => {
    try {
      const isEligibility =
        await this.voucherService.verifyEligibilityUser(voucher);

      if (!isEligibility) {
        throw new VoucherError(t("voucher_not_eligible"));
      }

      const isRedemption = await this.voucherService.verifyRedemptionUser(
        tokenKeyData,
        tokenJwtData,
        isEligibility,
        voucher
      );

      if (!isRedemption) {
        throw new VoucherError(t("voucher_not_redeemable"));
      }

      console.log("isRedemption", isRedemption);

      return true;
    } catch (error) {
      throw error;
    }
  };
}
