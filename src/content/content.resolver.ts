import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { ContentService } from './content.service';
import { Content, ContentVersion } from './entities/content.entity';
import { CreateContentInput } from './dto/create-content.input';
import { UpdateContentInput } from './dto/update-content.input';
import { ResetContentInput } from './dto/reset-content.input';
import { FindOneArgs } from './dto/find-one.args';
import { ListVersionsArgs } from './dto/list-versions.args';
import { FindManyArgs } from './dto/find-many.args';

@Resolver(() => Content)
export class ContentResolver {
  constructor(private readonly contentService: ContentService) {}

  @Query(() => [Content], { name: 'getContent' })
  findContent(@Args() findContentArgs: FindManyArgs) {
    return this.contentService.findMany(
      findContentArgs.limit,
      findContentArgs.offset,
    );
  }

  @Query(() => [ContentVersion], { name: 'getContentVersions' })
  findContentVersions(@Args() listVersionsArgs: ListVersionsArgs) {
    return this.contentService.findVersions(listVersionsArgs.title);
  }

  @Query(() => Content, { name: 'content' })
  findOne(@Args() findOneArgs: FindOneArgs) {
    return this.contentService.findOne(findOneArgs.title, findOneArgs.version);
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

  @Mutation(() => Content)
  resetToVersion(
    @Args('resetContentInput') resetContentInput: ResetContentInput,
  ) {
    return this.contentService.resetVersion(resetContentInput);
  }
}
