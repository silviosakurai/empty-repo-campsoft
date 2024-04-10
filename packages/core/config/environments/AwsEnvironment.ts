import * as dotenv from "dotenv";
import InvalidConfigurationError from "@core/common/exceptions/InvalidConfigurationError";

dotenv.config({
  path: "../../.env",
});

export class AwsEnvironment {
  private readonly AWS_SES_ACCESS_KEY_ID: string | undefined;
  private readonly AWS_SES_SECRET_ACCESS_KEY: string | undefined;
  private readonly AWS_SES_REGION: string | undefined;
  private readonly AWS_SES_EMAIL: string | undefined;
  private readonly AWS_S3_ACCESS_KEY_ID: string | undefined;
  private readonly AWS_S3_SECRET_ACCESS_KEY: string | undefined;
  private readonly AWS_S3_BUCKET_NAME: string | undefined;
  private readonly AWS_S3_REGION: string | undefined;

  constructor() {
    this.AWS_SES_ACCESS_KEY_ID = process.env.AWS_SES_ACCESS_KEY_ID;
    this.AWS_SES_SECRET_ACCESS_KEY = process.env.AWS_SES_SECRET_ACCESS_KEY;
    this.AWS_SES_REGION = process.env.AWS_SES_REGION;
    this.AWS_SES_EMAIL = process.env.AWS_SES_EMAIL;
    this.AWS_S3_ACCESS_KEY_ID = process.env.AWS_S3_ACCESS_KEY_ID;
    this.AWS_S3_SECRET_ACCESS_KEY = process.env.AWS_S3_SECRET_ACCESS_KEY;
    this.AWS_S3_BUCKET_NAME = process.env.AWS_S3_BUCKET_NAME;
    this.AWS_S3_REGION = process.env.AWS_S3_REGION;
  }

  public get sesAccessKeyId(): string {
    if (!this.AWS_SES_ACCESS_KEY_ID) {
      throw new InvalidConfigurationError(
        "AWS_SES_ACCESS_KEY_ID is not defined."
      );
    }

    return this.AWS_SES_ACCESS_KEY_ID;
  }

  public get sesSecretAccessKey(): string {
    if (!this.AWS_SES_SECRET_ACCESS_KEY) {
      throw new InvalidConfigurationError(
        "AWS_SES_SECRET_ACCESS_KEY is not defined."
      );
    }

    return this.AWS_SES_SECRET_ACCESS_KEY;
  }

  public get sesRegion(): string {
    if (!this.AWS_SES_REGION) {
      throw new InvalidConfigurationError("AWS_SES_REGION is not defined.");
    }

    return this.AWS_SES_REGION;
  }

  public get sesEmail(): string {
    if (!this.AWS_SES_EMAIL) {
      throw new InvalidConfigurationError("AWS_SES_EMAIL is not defined.");
    }

    return this.AWS_SES_EMAIL;
  }

  public get s3AccessKeyId(): string {
    if (!this.AWS_S3_ACCESS_KEY_ID) {
      throw new InvalidConfigurationError(
        "AWS_S3_ACCESS_KEY_ID is not defined."
      );
    }

    return this.AWS_S3_ACCESS_KEY_ID;
  }

  public get s3SecretAccessKey(): string {
    if (!this.AWS_S3_SECRET_ACCESS_KEY) {
      throw new InvalidConfigurationError(
        "AWS_S3_SECRET_ACCESS_KEY is not defined."
      );
    }

    return this.AWS_S3_SECRET_ACCESS_KEY;
  }

  public get s3BucketName(): string {
    if (!this.AWS_S3_BUCKET_NAME) {
      throw new InvalidConfigurationError("AWS_S3_BUCKET_NAME is not defined.");
    }

    return this.AWS_S3_BUCKET_NAME;
  }

  public get s3Region(): string {
    if (!this.AWS_S3_REGION) {
      throw new InvalidConfigurationError("AWS_S3_REGION is not defined.");
    }

    return this.AWS_S3_REGION;
  }
}
