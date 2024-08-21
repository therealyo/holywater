import { ArgsType, Field, ID } from '@nestjs/graphql';
import { IsUUID } from 'class-validator';
import { PaginationArgs } from 'src/common/pagination/offset-based.input';

@ArgsType()
export class ListVersionsArgs extends PaginationArgs {
  @Field(() => ID)
  @IsUUID()
  id: string;
}
