import { ArgsType, Field, ID, Int } from '@nestjs/graphql';
import { IsPositive, IsUUID } from 'class-validator';

@ArgsType()
export class FindOneArgs {
  @Field(() => ID)
  @IsUUID()
  id: string;

  @Field(() => Int, { nullable: true })
  @IsPositive()
  version?: number;
}
