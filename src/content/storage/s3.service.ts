import { Inject, Injectable } from '@nestjs/common';
import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
} from '@aws-sdk/client-s3';
import { ContentStorage } from 'src/content/interfaces/content-storage.interface';
import { CONTENT_BUCKET, S3_CLIENT } from 'src/storage/s3/s3.provider';

@Injectable()
export class S3ContentStorageService implements ContentStorage {
  constructor(
    @Inject(S3_CLIENT) private readonly s3Client: S3Client,
    @Inject(CONTENT_BUCKET) private readonly bucket: string,
  ) {}

  async save(id: string, version: number, payload: any): Promise<void> {
    const key = `${id}-${version}`;

    const command = new PutObjectCommand({
      Bucket: `${this.bucket}`,
      Key: key,
      ContentType: payload.mimetype,
      Body: payload.createReadStream(),
    });
    const response = await this.s3Client.send(command);

    console.log(response);
  }

  async findOne(id: string, version: number): Promise<string | undefined> {
    const key = `${id}-${version}`;
    const params = {
      // Bucket: this.config.get<string>('BUCKET_NAME'),
      Bucket: this.bucket,
      Key: key,
    };

    try {
      const command = new GetObjectCommand(params);
      const data = await this.s3Client.send(command);
      // Assuming data.Body is a Readable stream, you can convert it to a string
      return data.Body?.toString(); // Adjust according to how you handle the response
    } catch (error) {
      if (error.name === 'NoSuchKey') {
        return undefined;
      }
      throw error;
    }
  }
}
