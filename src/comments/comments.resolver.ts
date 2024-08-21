import { Resolver, Query, Mutation, Args, Context } from '@nestjs/graphql';
import { CommentsService } from './comments.service';
import { Comment, PaginatedComments } from './entities/comment.entity';
import { CreateCommentInput } from './dto/create-comment.input';
import { GetCommentsArgs } from './dto/get-comments.args';
import { MockAuthGuard } from 'src/auth/auth.guard';
import { UseGuards } from '@nestjs/common';
import { UserContext } from 'src/auth/context';

@Resolver(() => Comment)
export class CommentsResolver {
  constructor(private readonly commentsService: CommentsService) {}

  @Mutation(() => Comment)
  @UseGuards(MockAuthGuard)
  createComment(
    @Args('createCommentInput') createCommentInput: CreateCommentInput,
    @Context() context: UserContext,
  ) {
    return this.commentsService.create(createCommentInput, context.userId);
  }

  @Query(() => PaginatedComments, { name: 'comments' })
  getComments(
    @Args() getCommentsArgs: GetCommentsArgs,
  ): Promise<PaginatedComments> {
    return this.commentsService.findMany(getCommentsArgs);
  }
}
