import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { HttpStatus, Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { GraphQLFormattedError } from 'graphql';
import { v4 as uuidv4 } from 'uuid';

@Module({
  imports: [
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      formatError: (error: any): GraphQLFormattedError => {
        console.log(error);
        const graphQLFormattedError: GraphQLFormattedError = {
          message: error.message || 'Internal server error',
          extensions: {
            code: error.extensions?.status || HttpStatus.INTERNAL_SERVER_ERROR,
            name: error.extensions?.name || error.name,
            status:
              error.extensions?.status || HttpStatus.INTERNAL_SERVER_ERROR,
          },
        };

        return graphQLFormattedError;
        // return error;
      },
      context: () => {
        return { userId: uuidv4() };
      },
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
