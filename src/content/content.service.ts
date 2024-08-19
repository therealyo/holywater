import { Injectable } from '@nestjs/common';
import { CreateContentInput } from './dto/create-content.input';
import { UpdateContentInput } from './dto/update-content.input';
import { ResetContentInput } from './dto/reset-content.input';

@Injectable()
export class ContentService {
  create(createContentInput: CreateContentInput) {
    console.log('createContentInput:', createContentInput);
    return 'This action adds a new content';
  }

  findVersions(title: string) {
    return `This action returns all verions for ${title}`;
  }

  findOne(title: string, version: number) {
    return `This action returns a #${title} content, version ${version}`;
  }

  update(updateContentInput: UpdateContentInput) {
    console.log('updateContentInput:', updateContentInput);
    return `This action updates a #${updateContentInput.title} content`;
  }

  remove(id: string) {
    return `This action removes a #${id} content`;
  }

  resetVersion(resetContentInput: ResetContentInput) {
    console.log('resetContentInput', resetContentInput);
    return `This action resets a #${resetContentInput.title} content`;
  }
}
