import { Module } from '@nestjs/common';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ContentModule } from './content/content.module';
import { GraphqlModule } from './graphql/graphql.module';
import { ConfigModule } from './config/config.module';
import { CommentsModule } from './comments/comments.module';

@Module({
  imports: [GraphqlModule, ConfigModule, ContentModule, CommentsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  onApplicationBootstrap() {
    console.log('onApplicationBootstrap');
  }
}
