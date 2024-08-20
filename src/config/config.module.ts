import { Module } from '@nestjs/common';
import { ConfigModule as NestConfigModule } from '@nestjs/config';
// import { Environment } from './environment';
// import  from './aws.provider';

@Module({
  imports: [
    NestConfigModule.forRoot({
      // validate: () => {
      // throw new Error('Config not initalized');
      // },
      isGlobal: true,
      ignoreEnvFile: true,
      // load: [awsConfig, postgresConfig],
    }),
  ],
})
export class ConfigModule {}
