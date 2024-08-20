import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { s3Providers } from './s3.provider';

@Module({
  imports: [ConfigModule],
  providers: [...s3Providers],
  exports: [...s3Providers],
})
export class S3Module {}
