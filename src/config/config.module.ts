import { Module } from '@nestjs/common';
import { ConfigModule as NestConfigModule } from '@nestjs/config';
import { Environment } from './environment';

@Module({
  imports: [
    NestConfigModule.forRoot({
      // validate: () => {
      // throw new Error('Config not initalized');
      // },
      isGlobal: true,
      ignoreEnvFile:
        process.env.NODE_ENV === Environment.PRODUCTION ? true : false,
      envFilePath: '.env',
    }),
  ],
})
export class ConfigModule {}
