import { Field, ID, InputType } from '@nestjs/graphql';

import { CreateContentInput } from './create-content.input';
import { IsUUID } from 'class-validator';

@InputType()
export class UpdateContentInput extends CreateContentInput {
  @Field(() => ID)
  @IsUUID()
  id: string;
}
