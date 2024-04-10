import { injectable } from "tsyringe";
import { awsEnvironment } from "@core/config/environments";
import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { IStorageService } from "@core/interfaces/services/IStorage.service";

@injectable()
export class StorageService implements IStorageService {
  private client: S3Client;

  constructor() {
    this.client = new S3Client({ region: awsEnvironment.awsRegion });
  }

  public async uploadImage(clientId: string, imageBase64: string) {
    const buffer = Buffer.from(imageBase64, 'base64');

    const command = new PutObjectCommand({
      Bucket: awsEnvironment.awsBucketName,
      Key: `image/${clientId}`,
      Body: buffer,
    });
  
    try {
      await this.client.send(command);
      return this.createUrl(clientId);
    } catch (err) {
      console.error('StorageService : uploadImage : err:', err)
      return null;
    }
  }

  private createUrl = (clientId: string) => 
    `https://${awsEnvironment.awsBucketName}.s3.${awsEnvironment.awsRegion}.amazonaws.com/image/${clientId}`;
}
