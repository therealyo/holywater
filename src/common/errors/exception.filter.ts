import {
  ExceptionFilter,
  Catch,
  HttpStatus,
  HttpException,
} from '@nestjs/common';
import { NotFoundError } from './not-found.error';
import { GraphQLError } from 'graphql';

@Catch(GraphQLError)
export class GraphQLExceptionFilter implements ExceptionFilter {
  catch(exception: GraphQLError) {
    if (exception instanceof HttpException) {
      const status = exception.getStatus();
      const response = exception.getResponse();

      throw new GraphQLError(
        typeof response === 'string' ? response : (response as any).message,
        {
          extensions: {
            code: status,
            status,
            name: exception.name,
          },
        },
      );
    }

    let status = HttpStatus.INTERNAL_SERVER_ERROR;

    if (exception instanceof NotFoundError) {
      status = HttpStatus.NOT_FOUND;
    }

    throw new GraphQLError(exception.message, {
      extensions: {
        code:
          status === HttpStatus.NOT_FOUND
            ? 'NOT_FOUND'
            : 'INTERNAL_SERVER_ERROR',
        status,
      },
    });
  }
}
