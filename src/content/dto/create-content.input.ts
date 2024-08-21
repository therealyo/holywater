import { InputType, Field } from '@nestjs/graphql';
import { IsString } from 'class-validator';

import * as GraphQLUpload from 'graphql-upload/GraphQLUpload.js';
import { File } from 'src/upload/file';

@InputType()
export class CreateContentInput {
  @Field(() => String, { description: 'Content Title' })
  @IsString()
  title: string;

  @Field(() => GraphQLUpload, { description: 'Input for the content.' })
  content: File;
}
