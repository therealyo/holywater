import { S3Client } from '@aws-sdk/client-s3';
import { Provider } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

export const S3_CLIENT = Symbol.for('S3_CLIENT');
export const CONTENT_BUCKET = Symbol.for('CONTENT_BUCKET');

export const s3Providers: Provider[] = [
  {
    provide: S3_CLIENT,
    inject: [ConfigService],
    useFactory: (config: ConfigService) => {
      return new S3Client({
        region: config.get<string>('AWS_REGION'),
        endpoint: config.get<string>('BUCKET_ENDPOINT'),
        forcePathStyle: true,
      });
    },
  },
  {
    provide: CONTENT_BUCKET,
    inject: [ConfigService],
    useFactory: async (config: ConfigService) => {
      return config.get<string>('CONTENT_BUCKET_NAME');
    },
  },
];
