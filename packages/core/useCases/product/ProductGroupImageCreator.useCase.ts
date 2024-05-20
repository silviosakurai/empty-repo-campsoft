import { injectable } from "tsyringe";
import { StorageService } from "@core/services/storage.service";
import { TFunction } from "i18next";
import { validateImage } from "@core/common/functions/validateImage";
import { ProductGroupNotFoundError } from "@core/common/exceptions/ProductGroupNotFoundError";
import { ProductGroupImageType } from "@core/common/enums/models/product";
import { ProductService } from "@core/services/product.service";

@injectable()
export class ProductGroupImageCreatorUseCase {
  constructor(
    private readonly productService: ProductService,
    private readonly storageService: StorageService
  ) {}

  async create(
    t: TFunction<"translation", undefined>,
    groupId: number,
    type: ProductGroupImageType,
    image: string
  ) {
    validateImage(t, image);

    const group = await this.productService.findGroup(groupId);

    if (!group) {
      throw new ProductGroupNotFoundError(t("product_group_not_found"));
    }

    const response = await this.storageService.uploadImage(
      `${group.product_group_id}-${type}`,
      image
    );

    if (!response) {
      throw new Error(t("failed_to_update_image"));
    }

    const updated = await this.productService.updateGroupsImagesUrl(
      groupId,
      response
    );

    if (!updated) {
      return false;
    }

    return true;
  }
}
