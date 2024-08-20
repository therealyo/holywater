import { ConfigService } from '@nestjs/config';
import { drizzle } from 'drizzle-orm/node-postgres';
import { Client } from 'pg';

export const POSTGRES_CONNECTION = Symbol.for('POSTGRES_CONNECTION');
export const postgresProviders = [
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
];
