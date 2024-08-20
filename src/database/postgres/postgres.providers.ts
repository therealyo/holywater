import { Provider } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { drizzle } from 'drizzle-orm/node-postgres';
import { Client } from 'pg';
import { content } from './schema';

export const POSTGRES_CONNECTION = Symbol.for('POSTGRES_CONNECTION');
export const CONTENT_TABLE = Symbol.for('CONTENT_TABLE');
export const postgresProviders: Provider[] = [
  {
    provide: POSTGRES_CONNECTION,
    inject: [ConfigService],
    useFactory: async (configService: ConfigService) => {
      const client = new Client({
        connectionString: configService.get<string>('POSTGRES_URL'),
      });

      await client.connect();
      return drizzle(client);
    },
  },
  {
    provide: CONTENT_TABLE,
    useValue: content,
  },
];
