import { ClientService } from "@core/services/client.service";
import { injectable } from "tsyringe";
import { ClientCompanyStatus } from "@core/common/enums/models/clientCompany";
import { CreateClientResponse } from "@core/useCases/client/dtos/CreateClientResponse.dto";
import { IUserExistsFunction } from "@core/interfaces/repositories/client";
import { NotificationTemplate } from "@core/interfaces/services/IClient.service";
import { IReplaceTemplate } from "@core/common/interfaces/IReplaceTemplate";
import { TemplateModulo } from "@core/common/enums/TemplateMessage";
import { PermissionService } from "@core/services/permission.service";
import { CreateClientRequestPartnerDto } from "./dtos/CreateClientRequestPartner.dto";
import { EmailService } from "@core/services/email.service";
import { WhatsappService } from "@core/services/whatsapp.service";

@injectable()
export class ClientCreatorPartnerUseCase {
  constructor(
    private readonly clientService: ClientService,
    private readonly emailService: EmailService,
    private readonly whatsappService: WhatsappService,
    private readonly permissionService: PermissionService
  ) {}

  async create(
    partnerIds: number[],
    input: CreateClientRequestPartnerDto
  ): Promise<CreateClientResponse | null> {
    const response = await this.confirmIfRegisteredPreviously({
      cpf: input.cpf,
      email: input.email,
      phone: input.phone,
    });

    if (response) {
      return null;
    }

    const userCreated = await this.clientService.createPartner({
      ...input,
    });

    if (!userCreated) {
      return null;
    }

    const [permissionCreated, connectClientAndCompany] = await Promise.all([
      this.permissionService.create(userCreated.user_id),
      this.clientService.connectClient({
        clientId: userCreated.user_id,
        cpf: input.cpf,
        email: input.email,
        phoneNumber: input.phone,
        status: ClientCompanyStatus.ACTIVE,
      }),
    ]);

    if (!permissionCreated || !connectClientAndCompany) {
      return null;
    }

    this.sendNotification(partnerIds, input);

    return userCreated;
  }

  private sendNotification(
    partnerIds: number[],
    input: CreateClientRequestPartnerDto
  ) {
    const notificationTemplate = {
      email: input.email,
      phoneNumber: input.phone,
    } as NotificationTemplate;

    const replaceTemplate = {
      name: input.first_name ?? input.last_name,
    } as IReplaceTemplate;

    this.emailService.sendEmailToPartner(
      partnerIds,
      notificationTemplate,
      TemplateModulo.CADASTRO,
      replaceTemplate
    );

    this.whatsappService.sendWhatsappToPartner(
      partnerIds,
      notificationTemplate,
      TemplateModulo.CADASTRO,
      replaceTemplate
    );
  }

  private async confirmIfRegisteredPreviously(input: IUserExistsFunction) {
    const response = await this.clientService.listClientByCpfEmailPhone(input);

    if (response) return true;

    return false;
  }
}
