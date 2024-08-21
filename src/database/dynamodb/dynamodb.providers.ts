import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { Provider } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

export const DYNAMODB_CLIENT = Symbol.for('DYNAMODB_CLIENT');
export const COMMENTS_TABLE = Symbol.for('COMMENTS_TABLE');

export const dynamoDBProviders: Provider[] = [
  {
    provide: DYNAMODB_CLIENT,
    inject: [ConfigService],
    useFactory: (config: ConfigService) => {
      return new DynamoDBClient({
        region: config.get<string>('AWS_REGION'),
        endpoint: config.get<string>('DYNAMODB_URL'),
      });
    },
  },
  {
    provide: COMMENTS_TABLE,
    inject: [ConfigService],
    useFactory: async (config: ConfigService) => {
      return config.get<string>('COMMENTS_TABLE_NAME');
    },
  },
];
