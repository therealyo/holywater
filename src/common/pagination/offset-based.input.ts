import { ArgsType, Field, Int } from '@nestjs/graphql';
import { IsPositive } from 'class-validator';

@ArgsType()
export class PaginationArgs {
  @Field(() => Int, { nullable: true })
  @IsPositive()
  skip: number = 0;

  @Field(() => Int, { nullable: true })
  @IsPositive()
  limit: number = 10;
}
