import { injectable } from "tsyringe";
import { ClientService } from "@core/services/client.service";
import { StorageService } from "@core/services/storage.service";
import { TFunction } from "i18next";
import { ImageUpdaterResponse } from "./dtos/ImageUpdaterResponse.dto";

@injectable()
export class ClientImageUpdaterUseCase {
  constructor(
    private readonly clientService: ClientService,
    private readonly storageService: StorageService
  ) {}

  validateImage(
    t: TFunction<"translation", undefined>,
    imageBase64: string
  ): void {
    const regex = /^data:image\/([a-zA-Z]+);base64,(.+)$/;
    const match = regex.exec(imageBase64);

    if (!match) {
      throw new Error(t("invalid_image_format"));
    }

    const [, extension, base64Data] = match;

    if (!["png", "jpeg", "jpg"].includes(extension)) {
      throw new Error(t("format_not_supported_allowed_formats_png_jpeg_jpg"));
    }

    if (base64Data.length > 1024 * 1024 * 2) {
      throw new Error(t("image_size_exceeded_2mb"));
    }
  }

  async update(
    t: TFunction<"translation", undefined>,
    clientId: string,
    imageBase64: string
  ): Promise<ImageUpdaterResponse> {
    this.validateImage(t, imageBase64);

    const imageUrl = await this.storageService.uploadImage(
      clientId,
      imageBase64
    );

    if (!imageUrl) {
      throw new Error(t("failed_to_upload_image"));
    }

    const update = await this.clientService.updateImage(clientId, imageUrl);

    if (!update) {
      throw new Error(t("failed_to_update_image"));
    }

    return {
      client_id: clientId,
      image: imageUrl,
    };
  }
}
