import { injectable } from "tsyringe";
import { awsEnvironment } from "@core/config/environments";
import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { IStorageService } from "@core/interfaces/services/IStorage.service";

@injectable()
export class StorageService implements IStorageService {
  private client: S3Client;

  constructor() {
    this.client = new S3Client({
      region: awsEnvironment.s3Region,
      credentials: {
        accessKeyId: awsEnvironment.s3AccessKeyId,
        secretAccessKey: awsEnvironment.s3SecretAccessKey,
      },
    });
  }

  public async uploadImage(clientId: string, imageBase64: string) {
    const buffer = Buffer.from(imageBase64, "base64");

    const command = new PutObjectCommand({
      Bucket: awsEnvironment.s3BucketName,
      Key: `image/${clientId}`,
      Body: buffer,
    });

    try {
      await this.client.send(command);
      return this.createUrl(clientId);
    } catch (err) {
      console.error("StorageService : uploadImage : err:", err);
      return null;
    }
  }

  private createUrl = (clientId: string) =>
    `https://${awsEnvironment.s3BucketName}.s3.${awsEnvironment.s3Region}.amazonaws.com/image/${clientId}`;
}
