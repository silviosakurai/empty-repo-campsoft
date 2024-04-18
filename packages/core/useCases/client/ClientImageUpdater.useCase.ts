import { injectable } from "tsyringe";
import { ClientService } from "@core/services/client.service";
import { StorageService } from "@core/services/storage.service";
import { TFunction } from "i18next";
import { ImageUpdaterResponse } from "./dtos/ImageUpdaterResponse.dto";
import { validateImage } from "@core/common/functions/validateImage";

@injectable()
export class ClientImageUpdaterUseCase {
  constructor(
    private readonly clientService: ClientService,
    private readonly storageService: StorageService
  ) {}

  async update(
    t: TFunction<"translation", undefined>,
    clientId: string,
    imageBase64: string
  ): Promise<ImageUpdaterResponse> {
    validateImage(t, imageBase64);

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
