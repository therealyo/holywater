import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ContentModule } from './content/content.module';
import { GraphqlModule } from './graphql.module';

@Module({
  imports: [ContentModule, GraphqlModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
