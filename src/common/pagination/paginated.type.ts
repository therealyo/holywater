import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Type } from '@nestjs/common';

@ObjectType()
export class PageInfo {
  @Field(() => Date, { nullable: true })
  nextCursor?: Date;

  @Field(() => Boolean)
  hasNextPage: boolean;
}

export function Paginated<TItem>(TItemClass: Type<TItem>) {
  @ObjectType({ isAbstract: true })
  abstract class PaginatedType {
    @Field(() => [TItemClass])
    items: TItem[];

    @Field(() => Int)
    total: number;

    @Field(() => PageInfo)
    pageInfo: PageInfo;
  }
  return PaginatedType;
}
