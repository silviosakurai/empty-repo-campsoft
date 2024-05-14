import "reflect-metadata";
import { LoginAuthUseCase } from "../../../useCases/auth/LoginAuth.useCase";
import { AuthService } from "@core/services/auth.service";
import { PermissionService } from "@core/services/permission.service";
import { LoginRequest } from "@core/useCases/auth/dtos/LoginRequest.dto";
import { ClientGender, ClientStatus } from "@core/common/enums/models/client";

jest.mock("@core/services/auth.service");
jest.mock("@core/services/permission.service");

describe("Unit::LoginAuthUseCase", () => {
  let loginAuthUseCase: LoginAuthUseCase;
  let mockAuthService: jest.Mocked<AuthService>;
  let mockPermissionService: jest.Mocked<PermissionService>;

  beforeEach(() => {
    mockAuthService = {
      authenticate: jest.fn(),
    } as unknown as jest.Mocked<AuthService>;
    mockPermissionService = {
      findByCliendId: jest.fn(),
    } as unknown as jest.Mocked<PermissionService>;
    loginAuthUseCase = new LoginAuthUseCase(
      mockAuthService,
      mockPermissionService
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should return null if authentication fails", async () => {
    const loginRequest: LoginRequest = {
      login: "testuser",
      password: "testpassword",
    };
    mockAuthService.authenticate.mockResolvedValue(null);

    const result = await loginAuthUseCase.execute(loginRequest);

    expect(result).toBeNull();
    expect(mockAuthService.authenticate).toHaveBeenCalledWith(
      loginRequest.login,
      loginRequest.password
    );
    expect(mockPermissionService.findByCliendId).not.toHaveBeenCalled();
  });

  it("should return the authentication response and permissions if authentication succeeds", async () => {
    const loginRequest: LoginRequest = {
      login: "testuser",
      password: "testpassword",
    };
    const mockAuthResponse = {
      client_id: "testclientid",
      status: ClientStatus.ACTIVE,
      name: 'test',
      surname: 'test',
      birth_date: 'date',
      email:'test',
      phone: 'test',
      cpf: 'test',
      gender: ClientGender.MALE,
      photo: 'test',
    };
    const mockPermissions = [
      {
        action: 'action',
        company_id: null,
      },
    ];
    mockAuthService.authenticate.mockResolvedValue(mockAuthResponse);
    mockPermissionService.findByCliendId.mockResolvedValue(mockPermissions);

    const result = await loginAuthUseCase.execute(loginRequest);

    expect(result).toEqual({
      auth: mockAuthResponse,
      permissions: mockPermissions,
    });
    expect(mockAuthService.authenticate).toHaveBeenCalledWith(
      loginRequest.login,
      loginRequest.password
    );
    expect(mockPermissionService.findByCliendId).toHaveBeenCalledWith(
      mockAuthResponse.client_id
    );
  });
});