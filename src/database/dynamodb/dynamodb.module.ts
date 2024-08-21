import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { dynamoDBProviders } from './dynamodb.providers';

@Module({
  imports: [ConfigModule],
  providers: [...dynamoDBProviders],
  exports: [...dynamoDBProviders],
})
export class DynamoDBModule {}
