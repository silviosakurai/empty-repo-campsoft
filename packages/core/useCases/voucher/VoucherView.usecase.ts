import { injectable } from "tsyringe";
import { VoucherService } from "@core/services/voucher.service";
import { TFunction } from "i18next";
import { VoucherError } from "@core/common/exceptions/VoucherError";

@injectable()
export class VoucherViewUseCase {
  private voucherService: VoucherService;

  constructor(voucherService: VoucherService) {
    this.voucherService = voucherService;
  }

  view = async (t: TFunction<"translation", undefined>, voucher: string) => {
    try {
      const isEligibility =
        await this.voucherService.verifyEligibilityUser(voucher);

      if (!isEligibility) {
        throw new VoucherError(t("voucher_not_eligible"));
      }

      return true;
    } catch (error) {
      throw error;
    }
  };
}
