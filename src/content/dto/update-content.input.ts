import { InputType, Field, ID } from '@nestjs/graphql';

import * as GraphQLUpload from 'graphql-upload/GraphQLUpload.js';
import * as Upload from 'graphql-upload/Upload.js';

@InputType()
export class UpdateContentInput {
  @Field(() => ID)
  id: string;

  @Field(() => GraphQLUpload, { description: 'Input for the content file.' })
  content: Upload;
}
