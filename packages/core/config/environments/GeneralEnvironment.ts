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
  private readonly TFA_SECRET: string | undefined;
  private readonly TFA_SECRET_EXPIRES_IN: string | undefined;

  constructor() {
    this.APP_ENVIRONMENT = process.env
      .APP_ENVIRONMENT as unknown as AppEnvironment;
    this.JWT_SECRET = process.env.JWT_SECRET;
    this.JWT_SECRET_EXPIRES_IN = process.env.JWT_SECRET_EXPIRES_IN;
    this.TFA_SECRET = process.env.TFA_SECRET;
    this.TFA_SECRET_EXPIRES_IN = process.env.TFA_SECRET_EXPIRES_IN;
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

  public get tfaSecret(): string {
    if (!this.TFA_SECRET) {
      throw new InvalidConfigurationError("TFA_SECRET is not defined.");
    }

    return this.TFA_SECRET;
  }

  public get tfaSecretExpiresIn(): string {
    if (!this.TFA_SECRET_EXPIRES_IN) {
      throw new InvalidConfigurationError(
        "TFA_SECRET_EXPIRES_IN is not defined."
      );
    }

    return this.TFA_SECRET_EXPIRES_IN;
  }
}
