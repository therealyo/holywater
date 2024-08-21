import { PutItemCommand, QueryCommand } from '@aws-sdk/client-dynamodb';
import { Inject } from '@nestjs/common';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { Comment, PaginatedComments } from '../entities/comment.entity';
import { CommentStorage } from '../interfaces/comment-storage.interface';
import { marshall, unmarshall } from '@aws-sdk/util-dynamodb';
import {
  COMMENTS_TABLE,
  DYNAMODB_CLIENT,
} from 'src/database/dynamodb/dynamodb.providers';

export class DynamoDBCommentStorage implements CommentStorage {
  constructor(
    @Inject(DYNAMODB_CLIENT) private readonly client: DynamoDBClient,
    @Inject(COMMENTS_TABLE) private readonly table: string,
  ) {}

  async save(
    id: string,
    contentId: string,
    userId: string,
    text: string,
    createdAt: Date,
  ): Promise<void> {
    const item = {
      id,
      contentId,
      userId,
      text,
      createdAt: createdAt.valueOf(),
    };

    console.log(item);

    const command = new PutItemCommand({
      TableName: this.table,
      Item: marshall(item),
    });

    await this.client.send(command);
  }

  async find(
    contentId: string,
    limit: number,
    cursorValue?: number,
  ): Promise<PaginatedComments> {
    const { keyConditionExpression, expressionAttributeValues } =
      this.paginationConditions(contentId, cursorValue);

    const queryCommand = new QueryCommand({
      TableName: this.table,
      IndexName: 'ContentIndex',
      KeyConditionExpression: keyConditionExpression,
      ExpressionAttributeValues: expressionAttributeValues,
      Limit: limit,
      ScanIndexForward: false,
    });

    const queryResponse = await this.client.send(queryCommand);

    const items = (queryResponse.Items || []).map((item) => {
      const unmarshalledItem = unmarshall(item) as Comment;
      unmarshalledItem.createdAt = new Date(Number(unmarshalledItem.createdAt));
      return unmarshalledItem;
    });

    let nextCursor: Date | undefined = undefined;
    let hasNextPage = false;

    if (items.length > 0) {
      nextCursor = items[items.length - 1].createdAt;
      hasNextPage = items.length === limit;
    }

    return {
      items,
      pageInfo: {
        nextCursor,
        hasNextPage,
      },
      total: items.length,
    };
  }

  private paginationConditions = (contentId: string, cursorValue?: number) => {
    let keyConditionExpression = 'contentId = :contentId';
    const expressionAttributeValues = {
      ':contentId': { S: contentId },
    };

    if (cursorValue) {
      keyConditionExpression += ' AND createdAt < :createdAt';
      expressionAttributeValues[':createdAt'] = {
        N: cursorValue,
      };
    }

    return {
      keyConditionExpression,
      expressionAttributeValues,
    };
  };
}
