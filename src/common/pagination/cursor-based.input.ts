import { ArgsType, Field, Int } from '@nestjs/graphql';
import { IsOptional, IsPositive } from 'class-validator';

@ArgsType()
export class PaginationArgs {
  @Field(() => Int, { defaultValue: 10 })
  @IsPositive()
  limit: number = 10;

  @Field(() => Date, { nullable: true })
  @IsOptional()
  @IsPositive()
  cursor?: Date;
}
