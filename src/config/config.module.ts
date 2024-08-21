import { Module } from '@nestjs/common';
import { ConfigModule as NestConfigModule } from '@nestjs/config';

import * as Joi from '@hapi/joi';

export const configValidationSchema = Joi.object({
  NODE_ENV: Joi.string().valid('development', 'production', 'test').required(),
  AWS_ACCESS_KEY_ID: Joi.string().required(),
  AWS_SECRET_ACCESS_KEY: Joi.string().required(),
  AWS_REGION: Joi.string().required(),
  BUCKET_ENDPOINT: Joi.string().uri().required(),
  CONTENT_BUCKET_NAME: Joi.string().required(),
  POSTGRES_URL: Joi.string().uri().required(),
  DYNAMODB_URL: Joi.string().uri().required(),
  COMMENTS_TABLE_NAME: Joi.string().required(),
});

@Module({
  imports: [
    NestConfigModule.forRoot({
      validationSchema: configValidationSchema,
      isGlobal: true,
      ignoreEnvFile: true,
    }),
  ],
})
export class ConfigModule {}
