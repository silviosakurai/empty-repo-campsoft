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

  public mimeTypeToExtension = (extension: string): string => {
    let mimeType = "image/jpeg";

    if (extension === "png") {
      mimeType = "image/png";
    }

    return mimeType;
  };

  public async uploadImage(
    clientId: string,
    imageBase64: string
  ): Promise<string | null> {
    const regex = /^data:image\/([a-zA-Z]+);base64,(.+)$/;
    const match = regex.exec(imageBase64);

    if (!match) {
      return null;
    }

    const [, extension, base64Data] = match;
    const buffer = Buffer.from(base64Data, "base64");

    const command = new PutObjectCommand({
      Bucket: awsEnvironment.s3BucketName,
      Key: `image/${clientId}.${extension}`,
      Body: buffer,
      ContentType: this.mimeTypeToExtension(extension),
    });

    try {
      await this.client.send(command);
      return this.createUrl(clientId, extension);
    } catch (err) {
      console.error("StorageService : uploadImage : err:", err);
      return null;
    }
  }

  private createUrl = (clientId: string, extension: string) =>
    `https://${awsEnvironment.s3BucketName}.s3.${awsEnvironment.s3Region}.amazonaws.com/image/${clientId}.${extension}`;
}
