import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { ContentService } from './content.service';
import { Content, ContentVersion } from './entities/content.entity';
import { CreateContentInput } from './dto/create-content.input';
import { UpdateContentInput } from './dto/update-content.input';

@Resolver(() => Content)
export class ContentResolver {
  constructor(private readonly contentService: ContentService) {}

  @Mutation(() => Content)
  createContent(
    @Args('createContentInput') createContentInput: CreateContentInput,
  ) {
    return this.contentService.create(createContentInput);
  }

  @Query(() => [ContentVersion], { name: 'getContentVersions' })
  findContentVersions(@Args('title', { type: () => String }) title: string) {
    return this.contentService.findVersions(title);
  }

  @Query(() => Content, { name: 'content' })
  findOne(
    @Args('title', { type: () => String }) title: string,
    @Args('version', { type: () => Int }) version: number,
  ) {
    return this.contentService.findOne(title, version);
  }

  @Mutation(() => Content)
  updateContent(
    @Args('updateContentInput') updateContentInput: UpdateContentInput,
  ) {
    return this.contentService.update(updateContentInput);
  }
}
