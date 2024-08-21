import { InputType, Field } from '@nestjs/graphql';
import { IsString } from 'class-validator';

import * as GraphQLUpload from 'graphql-upload/GraphQLUpload.js';
import * as Upload from 'graphql-upload/Upload.js';

@InputType()
export class CreateContentInput {
  @Field(() => String, { description: 'Content Title' })
  @IsString()
  title: string;

  @Field(() => GraphQLUpload, { description: 'Input for the content.' })
  content: Promise<Upload>;
}
