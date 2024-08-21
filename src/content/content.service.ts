import { Inject, Injectable } from '@nestjs/common';

import {
  METADATA_STORAGE,
  MetadataStorage,
} from './interfaces/metadata-storage.interface';
import {
  CONTENT_STORAGE,
  ContentStorage,
} from './interfaces/content-storage.interface';
import { v4 as uuidv4 } from 'uuid';
import { Content, ContentVersion } from './entities/content.entity';
import { ListVersionsArgs } from './dto/list-versions.args';
import { FindOneArgs } from './dto/find-one.args';
import { ResetContentInput } from './dto/reset-content.input';
import { File } from 'src/upload/file';

@Injectable()
export class ContentService {
  constructor(
    @Inject(METADATA_STORAGE) private readonly metadataStorage: MetadataStorage,
    @Inject(CONTENT_STORAGE) private readonly contentStorage: ContentStorage,
  ) {}

  async findVersions(args: ListVersionsArgs): Promise<ContentVersion[]> {
    return this.metadataStorage.findVersions(args.id, args.limit, args.skip);
  }

  async findOne(args: FindOneArgs): Promise<Content> {
    const { id, version } = args;
    const metadata = await this.metadataStorage.findOne(id, version);
    if (!metadata) {
      throw new Error(`Content with ID ${id} not found`);
    }

    return {
      id,
      title: metadata.title,
      version: metadata.version,
      url: await this.contentStorage.downloadUrl(id, metadata.version),
      createdAt: metadata.createdAt,
    };
  }

  async create(title: string, upload: File): Promise<Content> {
    const id = uuidv4();
    const version = 1;
    const createdAt = new Date();

    await this.contentStorage.save(id, version, upload);
    await this.metadataStorage.save(id, version, createdAt, title);

    return {
      id,
      title,
      url: await this.contentStorage.downloadUrl(id, version),
      version,
      createdAt,
    };
  }

  async update(id: string, upload: File, title?: string): Promise<Content> {
    const lastVersion = await this.metadataStorage.findOne(id);

    if (!lastVersion) throw new Error('content not found');

    const newVersion = lastVersion.version + 1;
    const createdAt = new Date();

    await this.contentStorage.save(id, newVersion, upload);
    const updatedContent = await this.metadataStorage.save(
      id,
      newVersion,
      createdAt,
      title ? title : lastVersion.title,
    );

    console.log(updatedContent);

    return {
      id,
      title: updatedContent.title,
      url: await this.contentStorage.downloadUrl(id, newVersion),
      version: newVersion,
      createdAt,
    };
  }

  async resetVersion(resetContentInput: ResetContentInput): Promise<Content> {
    const { id, version } = resetContentInput;
    const metadata = await this.metadataStorage.findOne(id, version);

    if (!metadata) {
      throw new Error(
        `No metadata for content found with ID ${id} and version ${version}`,
      );
    }

    const content = await this.contentStorage.getOne(id, version);

    if (!content) {
      throw new Error(`No content found with ID ${id} and version ${version}`);
    }

    const newVersion = await this.update(id, content, metadata.title);

    return {
      id,
      title: newVersion.title,
      url: await this.contentStorage.downloadUrl(id, newVersion.version),
      version: newVersion.version,
      createdAt: newVersion.createdAt,
    };
  }
}
