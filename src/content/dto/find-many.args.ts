import { ArgsType } from '@nestjs/graphql';
import { PaginationArgs } from 'src/common/pagination.input';

@ArgsType()
export class FindManyArgs extends PaginationArgs {}
