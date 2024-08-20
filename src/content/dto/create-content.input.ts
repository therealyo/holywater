import { InputType, Field } from '@nestjs/graphql';

import * as GraphQLUpload from 'graphql-upload/GraphQLUpload.js';
import * as Upload from 'graphql-upload/Upload.js';

@InputType()
export class CreateContentInput {
  @Field(() => String, { description: 'Content Title' })
  title: string;

  @Field(() => GraphQLUpload, { description: 'Input for the content.' })
  content: Promise<Upload>;
}
