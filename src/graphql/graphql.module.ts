import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';

@Module({
  imports: [
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      formatError: (err) => ({
        message: err.message,
        status: err.extensions.code,
      }),
      useGlobalPrefix: true,
      path: '/graphql',
      autoSchemaFile: {
        path: 'schema.gql',
      },
      resolverValidationOptions: {
        requireResolversForAllFields: 'ignore',
        requireResolversForResolveType: 'ignore',
        requireResolversToMatchSchema: 'ignore',
      },
      plugins: [],
    }),
  ],
})
export class GraphqlModule {}
