import { Injectable } from '@nestjs/common';
import { S3 } from 'aws-sdk';
import { ConfigService } from '@nestjs/config';
import { v4 as uuid } from 'uuid';

@Injectable()
export class FileUploadService {
  constructor(private configService: ConfigService) {}

  /**
   * Upload file to aws cloud
   * @param dataBuffer
   * @param fileName
   * @param bucket
   */
  async uploadFile(
    dataBuffer: Buffer,
    fileName: string,
    bucket?: string,
  ): Promise<any> {
    const s3 = new S3();
    const uploadResult = await s3
      .upload({
        Bucket: bucket ? bucket : this.configService.get('AWS_BUCKET_NAME'),
        Body: dataBuffer,
        Key: `${uuid()}-${fileName}`,
      })
      .promise();

    const fileStorageInDB = {
      fileName: fileName,
      fileUrl: uploadResult.Location,
      key: uploadResult.Key,
    };
    return;
  }
}
