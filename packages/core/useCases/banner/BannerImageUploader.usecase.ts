import { injectable } from "tsyringe";
import { BannerService } from "@core/services/banner.service";
import { TFunction } from "i18next";
import { BannerImageRequestBodyDto } from "./dtos/BannerImageUploaderRequest.dto";
import { BannerImageType } from "@core/common/enums/models/banner";
import { validateImage } from "@core/common/functions/validateImage";
import { ITokenJwtData } from "@core/common/interfaces/ITokenJwtData";
import { checkIfCompanyHasAccess } from "@core/common/functions/checkIfCompanyHasAccess";
import { AccessType } from "@core/common/enums/models/access";
import { BannerNotFoundError } from "@core/common/exceptions/BannerNotFoundError";
import { StorageService } from "@core/services/storage.service";
import { BannerItemNotFoundError } from "@core/common/exceptions/BannerItemNotFoundError";

@injectable()
export class BannerImageUploaderUseCase {
  constructor(
    private readonly bannerService: BannerService,
    private readonly storageService: StorageService,
  ) {}

  async upload(
    t: TFunction<"translation", undefined>,
    tokenJwtData: ITokenJwtData,
    bannerId: number,
    bannerItemId: number,
    type: BannerImageType,
    input: BannerImageRequestBodyDto,
  ): Promise<boolean> {
    validateImage(t, input.image);

    const companyIdsAllowed = checkIfCompanyHasAccess(tokenJwtData.access, AccessType.PRODUCT_MANAGEMENT);

    const banner = await this.bannerService.viewByPartner(companyIdsAllowed, bannerId);

    if (!banner) {
      throw new BannerNotFoundError(t("banner_not_found"));
    }

    const bannerItem = banner?.items.find((item) => item.item_id === bannerItemId);

    if (!bannerItem) {
      throw new BannerItemNotFoundError(t("banner_item_not_found"));
    }

    const imageUrl = await this.storageService.uploadImage(
      `${bannerId}-${bannerItemId}-${type}`,
      input.image
    );

    if (!imageUrl) {
      throw new Error(t("failed_to_update_image"));
    }

    return this.bannerService.createImage(bannerId, bannerItemId, type, imageUrl);
  }
}
