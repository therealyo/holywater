import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class CreateCommentInput {
  @Field(() => String, { description: 'Related content id' })
  contentId: string;

  @Field(() => String, { description: 'Comment' })
  text: string;
}
