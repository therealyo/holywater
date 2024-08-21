import { ObjectType, Field, Int, ID } from '@nestjs/graphql';
import { PaginatedComments } from 'src/comments/entities/comment.entity';

@ObjectType()
export class Content {
  @Field(() => ID, { description: 'Primary id field for content' })
  id: string;

  @Field({ description: 'Content Title' })
  title: string;

  @Field({ description: 'Content URL' })
  url?: string;

  @Field(() => Int, { description: 'Queried content version' })
  version: number;

  @Field(() => Date, { description: 'Creation date of version' })
  createdAt: Date;

  @Field(() => PaginatedComments, { nullable: true })
  comments?: PaginatedComments;
}

@ObjectType()
export class ContentVersion {
  @Field(() => Int, { description: 'Queried content version' })
  version: number;

  @Field(() => Date, { description: 'Creation date of version' })
  createdAt: Date;
}
