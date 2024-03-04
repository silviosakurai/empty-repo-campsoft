import * as dotenv from "dotenv";
import InvalidConfigurationError from "@core/common/exceptions/InvalidConfigurationError";
import { AppEnvironment } from "@core/common/enums/AppEnvironment";

dotenv.config({
  path: "../../.env",
});

export class GeneralEnvironment {
  private readonly APP_ENVIRONMENT: AppEnvironment | undefined;
  private readonly API_CAMPSOFT: string | undefined;
  private readonly API_KEY_CAMPSOFT: string | undefined;

  constructor() {
    this.APP_ENVIRONMENT = process.env
      .APP_ENVIRONMENT as unknown as AppEnvironment;
    this.API_CAMPSOFT = process.env.API_CAMPSOFT;
    this.API_KEY_CAMPSOFT = process.env.API_KEY_CAMPSOFT;
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

  public get apiCampsoft() : string {
    if( this.API_CAMPSOFT === undefined || this.API_CAMPSOFT === null){
      throw new InvalidConfigurationError("API_CAMPSOFT is not valid.");
    }
    return this.API_CAMPSOFT;
  }

  public get apiKeyCampsoft() : string {
    if( this.API_KEY_CAMPSOFT === undefined || this.API_KEY_CAMPSOFT === null){
      throw new InvalidConfigurationError("API_KEY_CAMPSOFT is not valid.");
    }
            return this.API_KEY_CAMPSOFT;
  }
}
