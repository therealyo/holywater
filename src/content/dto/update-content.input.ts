import { Field, ID, InputType } from '@nestjs/graphql';

import { CreateContentInput } from './create-content.input';

@InputType()
export class UpdateContentInput extends CreateContentInput {
  @Field(() => ID)
  id: string;
}
