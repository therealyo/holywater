import { Inject, Module, OnModuleInit } from '@nestjs/common';
import { POSTGRES_CONNECTION, postgresProviders } from './postgres.providers';
import { ConfigModule } from 'src/config/config.module';
import { migrate } from 'drizzle-orm/node-postgres/migrator';
import { drizzle } from 'drizzle-orm/node-postgres';

@Module({
  imports: [ConfigModule],
  providers: [...postgresProviders],
  exports: [...postgresProviders],
})
export class PostgresModule implements OnModuleInit {
  constructor(
    @Inject(POSTGRES_CONNECTION)
    private readonly db: ReturnType<typeof drizzle>,
  ) {}

  async onModuleInit() {
    await migrate(this.db, { migrationsFolder: 'migrations' });
    console.log('Migrations completed');
  }
}
{
}
