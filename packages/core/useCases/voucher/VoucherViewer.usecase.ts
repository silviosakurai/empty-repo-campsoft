import { injectable } from "tsyringe";
import { VoucherService } from "@core/services/voucher.service";
import { TFunction } from "i18next";
import { VoucherError } from "@core/common/exceptions/VoucherError";
import { ITokenKeyData } from "@core/common/interfaces/ITokenKeyData";
import { VoucherViewRequestDto } from "@core/useCases/voucher/dtos/VoucherViewResponse.dto";

@injectable()
export class VoucherViewerUseCase {
  constructor(private readonly voucherService: VoucherService) {}

  view = async (
    t: TFunction<"translation", undefined>,
    tokenKeyData: ITokenKeyData,
    voucher: string
  ): Promise<VoucherViewRequestDto> => {
    const isEligibility = await this.voucherService.verifyEligibilityUser(
      tokenKeyData,
      voucher
    );

    if (!isEligibility) {
      throw new VoucherError(t("voucher_not_eligible"));
    }

    const [getVoucherDetails, listProductsUserResult, listPlansUserResult] =
      await Promise.all([
        this.voucherService.getVoucherDetails(tokenKeyData, voucher),
        this.voucherService.listVoucherEligibleProductsNotSignatureUser(
          tokenKeyData,
          voucher
        ),
        this.voucherService.listVoucherEligiblePlansNotSignatureUser(
          tokenKeyData,
          voucher
        ),
      ]);

    return {
      voucher: getVoucherDetails,
      products: listProductsUserResult,
      plan:
        listPlansUserResult && listPlansUserResult?.length > 0
          ? listPlansUserResult[0]
          : null,
    } as VoucherViewRequestDto;
  };
}
