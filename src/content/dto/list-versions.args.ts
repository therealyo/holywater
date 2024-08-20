import { ArgsType, Field, ID } from '@nestjs/graphql';
import { PaginationArgs } from 'src/common/pagination/pagination.input';

@ArgsType()
export class ListVersionsArgs extends PaginationArgs {
  @Field(() => ID)
  id: string;
}
