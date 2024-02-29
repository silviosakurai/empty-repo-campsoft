import dotenv from "dotenv";
import { AppEnvironment } from "@core/common/enums/AppEnvironment";
import InvalidConfigurationError from "@core/common/exceptions/InvalidConfigurationError";

dotenv.config({
  path: "../../.env",
});

class Environment {
  public readonly APP_ENVIRONMENT: AppEnvironment | undefined;
  public readonly DBHOST: string | undefined;
  public readonly DBPORT: number | undefined;
  public readonly DBUSER: string | undefined;
  public readonly DBPASSWORD: string | undefined;
  public readonly DBDATABASE: string | undefined;

  constructor() {
    this.APP_ENVIRONMENT = process.env
      .APP_ENVIRONMENT as unknown as AppEnvironment;
    this.DBHOST = process.env.DBHOST;
    this.DBPORT = Number(process.env.DBPORT);
    this.DBUSER = process.env.DBUSER;
    this.DBPASSWORD = process.env.DBPASSWORD;
    this.DBDATABASE = process.env.DBDATABASE;
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

  public get dbHost(): string {
    if (!this.DBHOST) {
      throw new InvalidConfigurationError("DBHOST is not defined.");
    }

    return this.DBHOST;
  }

  public get dbPort(): number {
    if (!this.DBPORT) {
      throw new InvalidConfigurationError("DBPORT is not defined.");
    }

    return this.DBPORT;
  }

  public get dbUser(): string {
    if (!this.DBUSER) {
      throw new InvalidConfigurationError("DBUSER is not defined.");
    }

    return this.DBUSER;
  }

  public get dbPassword(): string {
    if (!this.DBPASSWORD) {
      throw new InvalidConfigurationError("DBPASSWORD is not defined.");
    }

    return this.DBPASSWORD;
  }

  public get dbDatabase(): string {
    if (!this.DBDATABASE) {
      throw new InvalidConfigurationError("DBDATABASE is not defined.");
    }

    return this.DBDATABASE;
  }
}

export const environment = new Environment();
