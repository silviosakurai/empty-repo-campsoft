import { injectable } from "tsyringe";
import { VoucherService } from "@core/services/voucher.service";
import { TFunction } from "i18next";
import { VoucherError } from "@core/common/exceptions/VoucherError";
import { ITokenJwtData } from "@core/common/interfaces/ITokenJwtData";

@injectable()
export class VoucherViewUserUseCase {
  private voucherService: VoucherService;

  constructor(voucherService: VoucherService) {
    this.voucherService = voucherService;
  }

  view = async (
    t: TFunction<"translation", undefined>,
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
        tokenJwtData,
        isEligibility,
        voucher
      );

      if (!isRedemption) {
        throw new VoucherError(t("voucher_not_redeemable"));
      }

      return true;
    } catch (error) {
      throw error;
    }
  };
}
