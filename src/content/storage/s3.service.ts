import { Inject, Injectable } from '@nestjs/common';
import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
  GetObjectCommandInput,
} from '@aws-sdk/client-s3';
import { ContentStorage } from 'src/content/interfaces/content-storage.interface';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { CONTENT_BUCKET, S3_CLIENT } from 'src/storage/s3/s3.provider';
import { Readable } from 'stream';
import { replaceDevHost } from 'src/common/host-replace';
import { File } from 'src/upload/file';

@Injectable()
export class S3ContentStorageService implements ContentStorage {
  constructor(
    @Inject(S3_CLIENT) private readonly s3Client: S3Client,
    @Inject(CONTENT_BUCKET) private readonly bucket: string,
  ) {}

  async save(id: string, version: number, payload: File): Promise<void> {
    const key = `${id}/${version}`;

    const command = new PutObjectCommand({
      Bucket: `${this.bucket}`,
      Key: key,
      ContentType: payload.mimetype,
      Body: payload.uploadStream,
    });

    await this.s3Client.send(command);
  }

  async downloadUrl(id: string, version: number): Promise<string> {
    const key = `${id}/${version}`;

    const params: GetObjectCommandInput = {
      Bucket: this.bucket,
      Key: key,
    };

    const command = new GetObjectCommand(params);
    const url = await getSignedUrl(this.s3Client, command, { expiresIn: 3600 });

    return replaceDevHost(url);
  }

  async getOne(id: string, version: number): Promise<File | undefined> {
    const key = `${id}/${version}`;
    const params = {
      Bucket: this.bucket,
      Key: key,
    };

    try {
      const command = new GetObjectCommand(params);
      const data = await this.s3Client.send(command);

      const mimetype = data.ContentType;
      const stream = data.Body as Readable;

      return new File(mimetype, stream);
    } catch (error) {
      if (error.name === 'NoSuchKey') {
        return undefined;
      }
      throw error;
    }
  }
}
