import { Injectable, Inject } from '@nestjs/common';
import { CreateCommentInput } from './dto/create-comment.input';
import {
  COMMENT_STORAGE,
  CommentStorage,
} from './interfaces/comment-storage.interface';
import { v4 as uuidv4 } from 'uuid';
import { GetCommentsArgs } from './dto/get-comments.args';
import { PaginatedComments } from './entities/comment.entity';

@Injectable()
export class CommentsService {
  constructor(
    @Inject(COMMENT_STORAGE) private readonly commentStorage: CommentStorage,
  ) {}

  async create(createCommentInput: CreateCommentInput, userId: string) {
    const id = uuidv4();
    const createdAt = new Date();
    await this.commentStorage.save(
      id,
      createCommentInput.contentId,
      userId,
      createCommentInput.text,
      createdAt,
    );
    return {
      id,
      contentId: createCommentInput.contentId,
      userId,
      text: createCommentInput.text,
      createdAt,
    };
  }

  async findMany(args: GetCommentsArgs): Promise<PaginatedComments> {
    const { contentId, limit, cursor } = args;
    const { items, pageInfo, total } = await this.commentStorage.find(
      contentId,
      limit,
      cursor?.valueOf(),
    );

    return {
      items,
      total,
      pageInfo,
    };
  }
}
