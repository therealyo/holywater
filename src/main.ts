import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import * as graphqlUploadExpress from 'graphql-upload/graphqlUploadExpress.js';
import { GraphQLExceptionFilter } from './common/errors/exception.filter';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.use('/graphql', graphqlUploadExpress({ maxFiles: 1 }));
  app.useGlobalFilters(new GraphQLExceptionFilter());
  await app.listen(3000);
}
bootstrap();
