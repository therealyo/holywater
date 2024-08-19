import { InputType, Field, Int } from '@nestjs/graphql';

@InputType()
export class ResetContentInput {
  @Field(() => String, { description: 'Content Title' })
  title: string;

  @Field(() => Int, { description: 'Input for the content.' })
  version: number;
}
