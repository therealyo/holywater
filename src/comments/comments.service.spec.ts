import { Test, TestingModule } from '@nestjs/testing';
import { CommentsService } from './comments.service';
import {
  COMMENT_STORAGE,
  CommentStorage,
} from './interfaces/comment-storage.interface';
import { v4 as uuidv4 } from 'uuid';
import { CreateCommentInput } from './dto/create-comment.input';
import { GetCommentsArgs } from './dto/get-comments.args';
import { PaginatedComments } from './entities/comment.entity';

jest.mock('uuid', () => ({
  v4: jest.fn(),
}));

describe('CommentsService', () => {
  let service: CommentsService;
  let commentStorage: CommentStorage;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CommentsService,
        {
          provide: COMMENT_STORAGE,
          useValue: {
            save: jest.fn(),
            find: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<CommentsService>(CommentsService);
    commentStorage = module.get<CommentStorage>(COMMENT_STORAGE);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create and return a comment', async () => {
      const createCommentInput: CreateCommentInput = {
        contentId: 'content-id',
        text: 'This is a comment',
      };
      const userId = 'user-id';
      const id = 'mocked-uuid';
      const createdAt = new Date();

      (uuidv4 as jest.Mock).mockReturnValue(id);
      jest.spyOn(commentStorage, 'save').mockResolvedValue(void 0);

      const result = await service.create(createCommentInput, userId);

      expect(result).toEqual({
        id,
        contentId: createCommentInput.contentId,
        userId,
        text: createCommentInput.text,
        createdAt,
      });

      expect(commentStorage.save).toHaveBeenCalledWith(
        id,
        createCommentInput.contentId,
        userId,
        createCommentInput.text,
        createdAt,
      );
    });

    it('should throw an error if comment storage fails', async () => {
      const createCommentInput: CreateCommentInput = {
        contentId: 'content-id',
        text: 'This is a comment',
      };
      const userId = 'user-id';

      jest
        .spyOn(commentStorage, 'save')
        .mockRejectedValue(new Error('Storage failed'));

      await expect(service.create(createCommentInput, userId)).rejects.toThrow(
        'Storage failed',
      );
    });
  });

  describe('findMany', () => {
    it('should return paginated comments', async () => {
      const args: GetCommentsArgs = {
        contentId: 'content-id',
        limit: 10,
        cursor: null,
      };
      const paginatedComments: PaginatedComments = {
        items: [
          {
            id: 'comment-id-1',
            contentId: 'content-id',
            userId: 'user-id',
            text: 'First comment',
            createdAt: new Date(),
          },
        ],
        total: 1,
        pageInfo: {
          hasNextPage: false,
          nextCursor: null,
        },
      };

      jest.spyOn(commentStorage, 'find').mockResolvedValue(paginatedComments);

      const result = await service.findMany(args);

      expect(result).toEqual(paginatedComments);
      expect(commentStorage.find).toHaveBeenCalledWith(
        args.contentId,
        args.limit,
        args.cursor?.valueOf(),
      );
    });

    it('should return an empty result if no comments are found', async () => {
      const args: GetCommentsArgs = {
        contentId: 'content-id',
        limit: 10,
        cursor: null,
      };
      const paginatedComments: PaginatedComments = {
        items: [],
        total: 0,
        pageInfo: {
          hasNextPage: false,
          nextCursor: null,
        },
      };

      jest.spyOn(commentStorage, 'find').mockResolvedValue(paginatedComments);

      const result = await service.findMany(args);

      expect(result).toEqual(paginatedComments);
    });

    it('should throw an error if comment storage fails', async () => {
      const args: GetCommentsArgs = {
        contentId: 'content-id',
        limit: 10,
        cursor: null,
      };

      jest
        .spyOn(commentStorage, 'find')
        .mockRejectedValue(new Error('Storage failed'));

      await expect(service.findMany(args)).rejects.toThrow('Storage failed');
    });

    it('should handle pagination correctly when there is a cursor', async () => {
      const args: GetCommentsArgs = {
        contentId: 'content-id',
        limit: 10,
        cursor: new Date(),
      };
      const paginatedComments: PaginatedComments = {
        items: [
          {
            id: 'comment-id-1',
            contentId: 'content-id',
            userId: 'user-id',
            text: 'First comment',
            createdAt: new Date(),
          },
        ],
        total: 1,
        pageInfo: {
          hasNextPage: false,
          nextCursor: null,
        },
      };

      jest.spyOn(commentStorage, 'find').mockResolvedValue(paginatedComments);

      const result = await service.findMany(args);

      expect(result).toEqual(paginatedComments);
      expect(commentStorage.find).toHaveBeenCalledWith(
        args.contentId,
        args.limit,
        args.cursor?.valueOf(),
      );
    });
  });
});
