import "reflect-metadata";
import { ClientService } from "@core/services/client.service";
import { EmailService } from "@core/services/email.service";
import { WhatsappService } from "@core/services/whatsapp.service";
import { PermissionService } from "@core/services/permission.service";
import { CreateClientRequestPartnerDto } from "@core/useCases/client/dtos/CreateClientRequestPartner.dto";
import { ClientCreatorPartnerUseCase } from "@core/useCases/client/ClientCreatorPartner.useCase";
import { ClientCompanyStatus } from "@core/common/enums/models/clientCompany";
import { TemplateModulo } from "@core/common/enums/TemplateMessage";
import { ClientGender } from "@core/common/enums/models/client";

const input: CreateClientRequestPartnerDto = {
  cpf: "123456789",
  email: "test@example.com",
  phone: "1234567890",
  user_type: 1,
  leader_id: "id",
  first_name: "name",
  last_name: "lastname",
  birthday: "date",
  gender: ClientGender.MALE,
  obs: "string",
};

const userCreated = {
  user_id: "1",
};

const partnerIds: number[] = [1, 2, 3];

describe("ClientCreatorPartnerUseCase", () => {
  let clientCreatorPartnerUseCase: ClientCreatorPartnerUseCase;
  let mockClientService: jest.Mocked<ClientService>;
  let mockEmailService: jest.Mocked<EmailService>;
  let mockWhatsappService: jest.Mocked<WhatsappService>;
  let mockPermissionService: jest.Mocked<PermissionService>;

  beforeEach(() => {
    mockClientService = {
      createPartner: jest.fn(),
      connectClient: jest.fn(),
      listClientByCpfEmailPhone: jest.fn(),
    } as unknown as jest.Mocked<ClientService>;
    mockEmailService = {
      sendEmailToPartner: jest.fn(),
    } as unknown as jest.Mocked<EmailService>;
    mockWhatsappService = {
      sendWhatsappToPartner: jest.fn(),
    } as unknown as jest.Mocked<WhatsappService>;
    mockPermissionService = {
      create: jest.fn(),
    } as unknown as jest.Mocked<PermissionService>;
    clientCreatorPartnerUseCase = new ClientCreatorPartnerUseCase(
      mockClientService,
      mockEmailService,
      mockWhatsappService,
      mockPermissionService
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should return null if client is registered previously", async () => {
    
    mockClientService.listClientByCpfEmailPhone.mockResolvedValue([{ id_cliente: "id" }]);

    const result = await clientCreatorPartnerUseCase.create(partnerIds, input);

    expect(result).toBeNull();
    expect(mockClientService.listClientByCpfEmailPhone).toHaveBeenCalled();
    expect(mockClientService.createPartner).not.toHaveBeenCalled();
    expect(mockPermissionService.create).not.toHaveBeenCalled();
    expect(mockClientService.connectClient).not.toHaveBeenCalled();
    expect(mockEmailService.sendEmailToPartner).not.toHaveBeenCalled();
    expect(mockWhatsappService.sendWhatsappToPartner).not.toHaveBeenCalled();
  });

  it("should return null if client creation fails", async () => {
    mockClientService.listClientByCpfEmailPhone.mockResolvedValue(null);
    mockClientService.createPartner.mockResolvedValue(null);

    const result = await clientCreatorPartnerUseCase.create(partnerIds, input);

    expect(result).toBeNull();
    expect(mockClientService.listClientByCpfEmailPhone).toHaveBeenCalled();
    expect(mockClientService.createPartner).toHaveBeenCalledWith(input);
    expect(mockPermissionService.create).not.toHaveBeenCalled();
    expect(mockClientService.connectClient).not.toHaveBeenCalled();
    expect(mockEmailService.sendEmailToPartner).not.toHaveBeenCalled();
    expect(mockWhatsappService.sendWhatsappToPartner).not.toHaveBeenCalled();
  });

  it("should return null if permission creation fails", async () => {
    mockClientService.listClientByCpfEmailPhone.mockResolvedValue(null);
    mockClientService.createPartner.mockResolvedValue(userCreated);
    mockPermissionService.create.mockResolvedValue(false);

    const result = await clientCreatorPartnerUseCase.create(partnerIds, input);

    expect(result).toBeNull();
    expect(mockClientService.listClientByCpfEmailPhone).toHaveBeenCalled();
    expect(mockClientService.createPartner).toHaveBeenCalledWith(input);
    expect(mockPermissionService.create).toHaveBeenCalledWith(userCreated.user_id);
    expect(mockClientService.connectClient).toHaveBeenCalled();
    expect(mockEmailService.sendEmailToPartner).not.toHaveBeenCalled();
    expect(mockWhatsappService.sendWhatsappToPartner).not.toHaveBeenCalled();
  });

  it("should return null if client connection fails", async () => {
    mockClientService.listClientByCpfEmailPhone.mockResolvedValue(null);
    mockClientService.createPartner.mockResolvedValue(userCreated);
    mockPermissionService.create.mockResolvedValue(true);
    mockClientService.connectClient.mockResolvedValue(false);

    const result = await clientCreatorPartnerUseCase.create(partnerIds, input);

    expect(result).toBeNull();
    expect(mockClientService.listClientByCpfEmailPhone).toHaveBeenCalled();
    expect(mockClientService.createPartner).toHaveBeenCalledWith(input);
    expect(mockPermissionService.create).toHaveBeenCalledWith(userCreated.user_id);
    expect(mockClientService.connectClient).toHaveBeenCalledWith({
      clientId: userCreated.user_id,
      cpf: input.cpf,
      email: input.email,
      phoneNumber: input.phone,
      status: ClientCompanyStatus.ACTIVE,
    });
    expect(mockEmailService.sendEmailToPartner).not.toHaveBeenCalled();
    expect(mockWhatsappService.sendWhatsappToPartner).not.toHaveBeenCalled();
  });

  it("should create client, permission, connect client, and send notifications successfully", async () => {
    mockClientService.listClientByCpfEmailPhone.mockResolvedValue(null);
    mockClientService.createPartner.mockResolvedValue(userCreated);
    mockPermissionService.create.mockResolvedValue(true);
    mockClientService.connectClient.mockResolvedValue(true);

    await clientCreatorPartnerUseCase.create(partnerIds, input);

    expect(mockClientService.listClientByCpfEmailPhone).toHaveBeenCalled();
    expect(mockClientService.createPartner).toHaveBeenCalledWith(input);
    expect(mockPermissionService.create).toHaveBeenCalledWith(userCreated.user_id);
    expect(mockClientService.connectClient).toHaveBeenCalledWith({
      clientId: userCreated.user_id,
      cpf: input.cpf,
      email: input.email,
      phoneNumber: input.phone,
      status: ClientCompanyStatus.ACTIVE,
    });
    expect(mockEmailService.sendEmailToPartner).toHaveBeenCalledWith(
      partnerIds,
      {
        email: input.email,
        phoneNumber: input.phone,
      },
      TemplateModulo.CADASTRO,
      {
        name: input.first_name ?? input.last_name,
      }
    );
    expect(mockWhatsappService.sendWhatsappToPartner).toHaveBeenCalledWith(
      partnerIds,
      {
        email: input.email,
        phoneNumber: input.phone,
      },
      TemplateModulo.CADASTRO,
      {
        name: input.first_name ?? input.last_name,
      }
    );
  });
});