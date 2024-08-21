import { InputType, Field, ID, PartialType } from '@nestjs/graphql';
import { IsUUID } from 'class-validator';
import { CreateContentInput } from './create-content.input';

@InputType()
export class UpdateContentInput extends PartialType(CreateContentInput) {
  @Field(() => ID)
  @IsUUID()
  id: string;
}
