import { ArgsType, Field, Int } from '@nestjs/graphql';
import { PaginationArgs } from 'src/common/pagination/pagination.input';

@ArgsType()
export class FindOneArgs extends PaginationArgs {
  @Field(() => String)
  title: string;

  @Field(() => Int)
  version: number;
}
