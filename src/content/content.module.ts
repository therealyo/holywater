import { Module } from '@nestjs/common';

import { ContentService } from './content.service';
import { ContentResolver } from './content.resolver';
import { METADATA_STORAGE } from './interfaces/metadata-storage.interface';
import { CONTENT_STORAGE } from './interfaces/content-storage.interface';
import { S3Module } from 'src/storage/s3/s3.module';
import { PostgresMetadataStorage } from './metadata/storage.service';
import { PostgresModule } from 'src/database/postgres/postgres.module';
import { S3ContentStorageService } from './storage/s3.service';

@Module({
  imports: [S3Module, PostgresModule],
  providers: [
    ContentResolver,
    ContentService,
    {
      provide: METADATA_STORAGE,
      useClass: PostgresMetadataStorage,
    },
    {
      provide: CONTENT_STORAGE,
      useClass: S3ContentStorageService,
    },
  ],
})
export class ContentModule {}
