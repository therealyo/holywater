import { Module } from '@nestjs/common';
import { CommentsService } from './comments.service';
import { CommentsResolver } from './comments.resolver';
import { DynamoDBModule } from 'src/database/dynamodb/dynamodb.module';
import { COMMENT_STORAGE } from './interfaces/comment-storage.interface';
import { DynamoDBCommentStorage } from './storage/dynamodb.service';

@Module({
  imports: [DynamoDBModule],
  providers: [
    CommentsResolver,
    CommentsService,
    {
      provide: COMMENT_STORAGE,
      useClass: DynamoDBCommentStorage,
    },
  ],
  exports: [CommentsService],
})
export class CommentsModule {}
