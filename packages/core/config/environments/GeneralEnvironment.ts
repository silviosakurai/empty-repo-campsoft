import * as dotenv from "dotenv";
import InvalidConfigurationError from "@core/common/exceptions/InvalidConfigurationError";
import { AppEnvironment } from "@core/common/enums/AppEnvironment";

dotenv.config({
  path: "../../.env",
});

export class GeneralEnvironment {
  private readonly APP_ENVIRONMENT: AppEnvironment | undefined;

  constructor() {
    this.APP_ENVIRONMENT = process.env
      .APP_ENVIRONMENT as unknown as AppEnvironment;
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
}
