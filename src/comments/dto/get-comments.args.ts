// src/comments/dto/get-comments.args.ts
import { ArgsType, Field } from '@nestjs/graphql';
import { PaginationArgs } from 'src/common/pagination/cursor-based.input';
import { IsUUID } from 'class-validator';

@ArgsType()
export class GetCommentsArgs extends PaginationArgs {
  @Field(() => String)
  @IsUUID()
  contentId: string;
}
