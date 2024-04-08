import { injectable } from "tsyringe";
import { VoucherService } from "@core/services/voucher.service";
import { TFunction } from "i18next";
import { VoucherError } from "@core/common/exceptions/VoucherError";
import { ITokenJwtData } from "@core/common/interfaces/ITokenJwtData";
import { ITokenKeyData } from "@core/common/interfaces/ITokenKeyData";
import { VoucherViewRequestDto } from "@core/useCases/voucher/dtos/VoucherViewResponse.dto";

@injectable()
export class VoucherViewerUserUseCase {
  constructor(private readonly voucherService: VoucherService) {}

  view = async (
    t: TFunction<"translation", undefined>,
    tokenKeyData: ITokenKeyData,
    tokenJwtData: ITokenJwtData,
    voucher: string
  ): Promise<VoucherViewRequestDto> => {
    const isEligibility = await this.voucherService.verifyEligibilityUser(
      tokenKeyData,
      voucher
    );

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

    const isClientSignatureActive =
      await this.voucherService.isClientSignatureActive(tokenJwtData);

    const [listProductsUserResult, listPlansUserResult] = await Promise.all([
      this.voucherService.listVoucherEligibleProductsUser(
        tokenKeyData,
        tokenJwtData,
        voucher,
        isClientSignatureActive
      ),
      this.voucherService.listVoucherEligiblePlansUser(
        tokenKeyData,
        tokenJwtData,
        voucher,
        isClientSignatureActive
      ),
    ]);

    return {
      products: listProductsUserResult,
      plan:
        listPlansUserResult && listPlansUserResult?.length > 0
          ? listPlansUserResult[0]
          : null,
    } as VoucherViewRequestDto;
  };
}
