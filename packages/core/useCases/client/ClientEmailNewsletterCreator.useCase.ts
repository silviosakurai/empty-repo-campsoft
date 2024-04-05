import { ClientService } from "@core/services";
import { injectable } from "tsyringe";

@injectable()
export class ClientEmailNewsletterCreatorUseCase {
  constructor(private readonly clientService: ClientService) {}

  async create(clientId: string, email: string) {
    const client = await this.clientService.clientEmailViewByEmail(email);

    await this.clientService.createEmailNewsletter(clientId, 2);

    if (!client) {
      await this.clientService.createEmail({
        clientId,
        email,
        emailType: 1,
      });

      return true;
    }

    if (!client[0].token) {
      await this.clientService.createEmail({
        clientId,
        email,
        emailType: 1,
      });

      return true;
    }

    return false;
  }
}
