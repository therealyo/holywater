import {
  Resolver,
  Query,
  Mutation,
  Args,
  ResolveField,
  Parent,
} from '@nestjs/graphql';
import { ContentService } from './content.service';
import { Content, ContentVersion } from './entities/content.entity';
import { CreateContentInput } from './dto/create-content.input';
import { UpdateContentInput } from './dto/update-content.input';
import { FindOneArgs } from './dto/find-one.args';
import { ListVersionsArgs } from './dto/list-versions.args';
import { PaginatedComments } from 'src/comments/entities/comment.entity';
import { CommentsService } from 'src/comments/comments.service';
import { PaginateComments } from './dto/paginate-comments.args';

@Resolver(() => Content)
export class ContentResolver {
  constructor(
    private readonly contentService: ContentService,
    private readonly commentService: CommentsService,
  ) {}

  @Query(() => [ContentVersion], { name: 'getContentVersions' })
  findContentVersions(@Args() listVersionsArgs: ListVersionsArgs) {
    return this.contentService.findVersions(listVersionsArgs);
  }

  @Query(() => Content, { name: 'content' })
  async findOne(@Args() findOneArgs: FindOneArgs) {
    console.log(await this.contentService.findOne(findOneArgs));
    return this.contentService.findOne(findOneArgs);
  }

  @Mutation(() => Content)
  createContent(
    @Args('createContentInput') createContentInput: CreateContentInput,
  ) {
    return this.contentService.create(createContentInput);
  }

  @Mutation(() => Content)
  updateContent(
    @Args('updateContentInput') updateContentInput: UpdateContentInput,
  ) {
    return this.contentService.update(updateContentInput);
  }

  // @Mutation(() => Content)
  // resetToVersion(
  //   @Args('resetContentInput') resetContentInput: ResetContentInput,
  // ) {
  //   return this.contentService.resetVersion(resetContentInput);
  // }

  @ResolveField(() => PaginatedComments, {
    description: 'Paginated comments for content',
  })
  async comments(
    @Parent() content: Content,
    @Args() paginatation: PaginateComments,
  ): Promise<PaginatedComments> {
    return this.commentService.findMany({
      contentId: content.id,
      limit: paginatation.limit,
      cursor: paginatation.cursor ? new Date(paginatation.cursor) : undefined,
    });
  }
}
