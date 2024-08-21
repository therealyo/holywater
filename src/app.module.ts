import { Module } from '@nestjs/common';

import { ContentModule } from './content/content.module';
import { GraphqlModule } from './graphql/graphql.module';
import { ConfigModule } from './config/config.module';
import { CommentsModule } from './comments/comments.module';
import { HealthController } from './health/health.controller';

@Module({
  imports: [GraphqlModule, ConfigModule, ContentModule, CommentsModule],
  controllers: [HealthController],
})
export class AppModule {}
