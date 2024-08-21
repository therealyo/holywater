import { ArgsType, Field, Int } from '@nestjs/graphql';
import { IsPositive } from 'class-validator';

@ArgsType()
export class PaginationArgs {
  @Field(() => Int)
  @IsPositive()
  skip: number = 0;

  @Field(() => Int)
  @IsPositive()
  limit: number = 10;
}
