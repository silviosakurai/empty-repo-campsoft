import * as dotenv from "dotenv";
import InvalidConfigurationError from "@core/common/exceptions/InvalidConfigurationError";

dotenv.config({
  path: "../../.env",
});

export class AwsEnvironment {
  private readonly AWS_ACCESS_KEY_ID: string | undefined;
  private readonly AWS_SECRET_ACCESS_KEY: string | undefined;
  private readonly AWS_REGION: string | undefined;
  private readonly AWS_SES_EMAIL: string | undefined;

  constructor() {
    this.AWS_ACCESS_KEY_ID = process.env.AWS_ACCESS_KEY_ID;
    this.AWS_SECRET_ACCESS_KEY = process.env.AWS_SECRET_ACCESS_KEY;
    this.AWS_REGION = process.env.AWS_REGION;
    this.AWS_SES_EMAIL = process.env.AWS_SES_EMAIL;
  }

  public get awsAccessKeyId(): string {
    if (!this.AWS_ACCESS_KEY_ID) {
      throw new InvalidConfigurationError("AWS_ACCESS_KEY_ID is not defined.");
    }

    return this.AWS_ACCESS_KEY_ID;
  }

  public get awsSecretAccessKey(): string {
    if (!this.AWS_SECRET_ACCESS_KEY) {
      throw new InvalidConfigurationError("AWS_SECRET_ACCESS_KEY is not defined.");
    }

    return this.AWS_SECRET_ACCESS_KEY;
  }

  public get awsRegion(): string {
    if (!this.AWS_REGION) {
      throw new InvalidConfigurationError("AWS_REGION is not defined.");
    }

    return this.AWS_REGION;
  }

  public get awsSesEmail(): string {
    if (!this.AWS_SES_EMAIL) {
      throw new InvalidConfigurationError("AWS_SES_EMAIL is not defined.");
    }

    return this.AWS_SES_EMAIL;
  }
}
