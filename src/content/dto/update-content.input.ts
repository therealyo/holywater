import { InputType, Field } from '@nestjs/graphql';

import * as GraphQLUpload from 'graphql-upload/GraphQLUpload.js';
import * as Upload from 'graphql-upload/Upload.js';

@InputType()
export class UpdateContentInput {
  @Field(() => String)
  id: string;

  @Field(() => GraphQLUpload, { description: 'Input for the content file.' })
  content: Upload;
}
