import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common';
import * as Upload from 'graphql-upload/Upload.js';
import { File } from 'src/upload/file';

@Injectable()
export class FileTransformPipe implements PipeTransform {
  constructor(private readonly allowedMimetypes: string[]) {}

  async transform(input: { content: Promise<Upload>; [key: string]: any }) {
    const { content, ...rest } = input;
    const file = await content;

    if (!file || !this.allowedMimetypes.includes(file.mimetype)) {
      throw new BadRequestException(
        `Invalid file type. Only ${this.allowedMimetypes.join(', ')} files are allowed.`,
      );
    }

    return {
      ...rest,
      content: new File(file.mimetype, file.createReadStream()),
    };
  }
}
