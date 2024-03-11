import * as dotenv from "dotenv";
import InvalidConfigurationError from "@core/common/exceptions/InvalidConfigurationError";
import { AppEnvironment } from "@core/common/enums/AppEnvironment";

dotenv.config({
  path: "../../.env",
});

export class GeneralEnvironment {
  private readonly APP_ENVIRONMENT: AppEnvironment | undefined;
  private readonly JWT_SECRET: string | undefined;
  private readonly JWT_SECRET_EXPIRES_IN: string | undefined;
  private readonly BASE_URL_CAMPSOFT_API: string | undefined;
  private readonly API_KEY_CAMPSOFT: string | undefined;


  constructor() {
    this.APP_ENVIRONMENT = process.env
      .APP_ENVIRONMENT as unknown as AppEnvironment;
    this.JWT_SECRET = process.env.JWT_SECRET;
    this.JWT_SECRET_EXPIRES_IN = process.env.JWT_SECRET_EXPIRES_IN;
    this.API_KEY_CAMPSOFT = process.env.API_KEY_CAMPSOFT;
    this.BASE_URL_CAMPSOFT_API = process.env.BASE_URL_CAMPSOFT_API;
  }

  public get appEnvironment(): AppEnvironment {
    if (!this.APP_ENVIRONMENT) {
      throw new InvalidConfigurationError("APP_ENVIRONMENT is not defined.");
    }

    if (
      this.APP_ENVIRONMENT !== AppEnvironment.DEV &&
      this.APP_ENVIRONMENT !== AppEnvironment.HMG &&
      this.APP_ENVIRONMENT !== AppEnvironment.PROD
    ) {
      throw new InvalidConfigurationError("APP_ENVIRONMENT is not valid.");
    }

    return this.APP_ENVIRONMENT;
  }

  public get jwtSecret(): string {
    if (!this.JWT_SECRET) {
      throw new InvalidConfigurationError("JWT_SECRET is not defined.");
    }

    return this.JWT_SECRET;
  }

  public get jwtSecretExpiresIn(): string {
    if (!this.JWT_SECRET_EXPIRES_IN) {
      throw new InvalidConfigurationError(
        "JWT_SECRET_EXPIRES_IN is not defined."
      );
    }

    return this.JWT_SECRET_EXPIRES_IN;
  }

  public get apiKeyCampsoft(): string {
    if (!this.API_KEY_CAMPSOFT) {
      throw new InvalidConfigurationError(
        "API_KEY_CAMPSOFT is not defined."
      );
    }

    return this.API_KEY_CAMPSOFT;
  }


  public get apiCampsoft(): string {
    if (!this.BASE_URL_CAMPSOFT_API) {
      throw new InvalidConfigurationError(
        "BASE_URL_CAMPSOFT_API is not defined."
      );
    }

    return this.BASE_URL_CAMPSOFT_API;
  }
}
