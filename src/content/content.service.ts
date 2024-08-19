import { Injectable } from '@nestjs/common';
import { CreateContentInput } from './dto/create-content.input';
import { UpdateContentInput } from './dto/update-content.input';

@Injectable()
export class ContentService {
  create(createContentInput: CreateContentInput) {
    console.log('createContentInput:', createContentInput);
    return 'This action adds a new content';
  }

  findAll() {
    return `This action returns all content`;
  }

  findOne(id: string) {
    return `This action returns a #${id} content`;
  }

  update(id: string, updateContentInput: UpdateContentInput) {
    console.log('updateContentInput:', updateContentInput);
    return `This action updates a #${id} content`;
  }

  remove(id: string) {
    return `This action removes a #${id} content`;
  }
}
