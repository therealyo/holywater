import { InputType, Field, Int, ID } from '@nestjs/graphql';

@InputType()
export class ResetContentInput {
  @Field(() => ID, { description: 'Content ID' })
  id: string;

  @Field(() => Int, { description: 'Input for the content.' })
  version: number;
}
