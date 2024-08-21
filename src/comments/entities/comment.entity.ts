import { ObjectType, Field, ID } from '@nestjs/graphql';
import { IsDate, IsString, IsUUID } from 'class-validator';
import { Paginated } from 'src/common/pagination/paginated.type';

@ObjectType()
export class Comment {
  @Field(() => ID, { description: 'Comment ID' })
  @IsUUID()
  id: string;

  @Field(() => String, { description: 'Related content ID' })
  @IsUUID()
  contentId: string;

  @Field(() => String, { description: 'User Id' })
  @IsUUID()
  userId: string;

  @Field(() => String)
  @IsString()
  text: string;

  @Field(() => Date)
  @IsDate()
  createdAt: Date;
}

@ObjectType()
export class PaginatedComments extends Paginated(Comment) {}
