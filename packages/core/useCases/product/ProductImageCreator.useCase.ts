import { injectable } from "tsyringe";
import { CreateProductImageInput } from "./dtos/CreateProductImageRequest.dto";
import { StorageService } from "@core/services/storage.service";
import { ProductNotFoundError } from "@core/common/exceptions/ProductNotFoundError";
import { TFunction } from "i18next";
import { validateImage } from "@core/common/functions/validateImage";
import { ProductService } from "@core/services/product.service";

@injectable()
export class ProductImageCreatorUseCase {
  constructor(
    private readonly productService: ProductService,
    private readonly storageService: StorageService
  ) {}

  async create(
    t: TFunction<"translation", undefined>,
    companyId: number,
    input: CreateProductImageInput
  ) {
    validateImage(t, input.image);

    const product = await this.productService.view(companyId, input.sku);

    if (!product) {
      throw new ProductNotFoundError(t("product_not_found"));
    }

    const response = await this.storageService.uploadImage(
      `${product.product_id}-${input.type}`,
      input.image
    );

    if (!response) {
      throw new Error(t("failed_to_update_image"));
    }

    const updated = await this.productService.updateImagesUrl(input.sku, {
      iconUrl: input.type === "icon" ? response : product.images.icon,
      imageUrl: input.type === "image" ? response : product.images.main_image,
      logoUrl: input.type === "logo" ? response : product.images.logo,
    });

    if (!updated) {
      return false;
    }

    return true;
  }
}
