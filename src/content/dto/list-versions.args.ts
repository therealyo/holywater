import { ArgsType, Field } from '@nestjs/graphql';
import { PaginationArgs } from 'src/common/pagination/pagination.input';

@ArgsType()
export class ListVersionsArgs extends PaginationArgs {
  @Field(() => String)
  title: string;
}
