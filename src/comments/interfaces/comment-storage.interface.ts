import { PaginatedComments } from '../entities/comment.entity';

export interface CommentStorage {
  save(
    id: string,
    contentId: string,
    userId: string,
    text: string,
    createdAt: Date,
  ): Promise<void>;
  find(
    contentId: string,
    limit: number,
    nextValue: number,
  ): Promise<PaginatedComments>;
}

export const COMMENT_STORAGE = Symbol.for('COMMENT_STORAGE');
