import { injectable } from "tsyringe";
import { ClientService } from "@core/services/client.service";
import { StorageService } from "@core/services/storage.service";

@injectable()
export class ClientImageUpdaterUseCase {
  constructor(
    private readonly clientService: ClientService,
    private readonly storageService: StorageService,
  ) {}

  async update(clientId: string, imageBase64: string): Promise<boolean> {
    const imageUrl = await this.storageService.uploadImage(clientId, imageBase64);

    if (!imageUrl) {
      throw new Error('Failed to upload image');
    }

    return this.clientService.updateImage(clientId, imageUrl);
  }
}
