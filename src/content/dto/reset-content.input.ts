import { InputType, Field, Int, ID } from '@nestjs/graphql';
import { IsPositive, IsUUID } from 'class-validator';

@InputType()
export class ResetContentInput {
  @Field(() => ID, { description: 'Content ID' })
  @IsUUID()
  id: string;

  @Field(() => Int, { description: 'Version of the content to reset to' })
  @IsPositive()
  version: number;
}
