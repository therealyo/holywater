import {
  ExceptionFilter,
  Catch,
  //   ArgumentsHost,
  HttpStatus,
} from '@nestjs/common';
import { NotFoundError } from './not-found.error';
import { GraphQLError } from 'graphql';

@Catch(Error)
export class GraphQLExceptionFilter implements ExceptionFilter {
  catch(exception: Error) {
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
