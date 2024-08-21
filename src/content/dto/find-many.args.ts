import { ArgsType } from '@nestjs/graphql';
import { PaginationArgs } from 'src/common/pagination/offset-based.input';

@ArgsType()
export class FindManyArgs extends PaginationArgs {}
