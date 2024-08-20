import { Inject, Injectable } from '@nestjs/common';
import { CreateContentInput } from './dto/create-content.input';
import { UpdateContentInput } from './dto/update-content.input';

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

@Injectable()
export class ContentService {
  constructor(
    @Inject(METADATA_STORAGE) private readonly metadataStorage: MetadataStorage,
    @Inject(CONTENT_STORAGE) private readonly contentStorage: ContentStorage,
  ) {}

  async findVersions(id: string): Promise<ContentVersion[]> {
    return this.metadataStorage.findVersions(id);
  }

  async findOne(id: string, version: number): Promise<Content> {
    const metadata = await this.metadataStorage.findOne(id, version);
    if (!metadata) {
      throw new Error(`Content with ID ${id} and version ${version} not found`);
    }

    const contentUrl = await this.contentStorage.findOne(id, version);
    return {
      id,
      title: metadata.title,
      version,
      url: contentUrl,
      createdAt: metadata.createdAt,
    };
  }

  async create(createContentInput: CreateContentInput): Promise<Content> {
    const id = uuidv4();
    const version = 1;
    const createdAt = new Date();

    await this.contentStorage.save(
      id,
      version,
      await createContentInput.content,
    );
    await this.metadataStorage.save(
      id,
      createContentInput.title,
      version,
      createdAt,
    );

    return {
      id,
      title: createContentInput.title,
      url: `mock/${id}-${version}`,
      version,
      createdAt,
    };
  }

  async update(updateContentInput: UpdateContentInput): Promise<Content> {
    const { id, title } = updateContentInput;

    const latestVersion = await this.metadataStorage.latestVersion(id);

    if (!latestVersion) throw new Error('content not found');

    const newVersion = latestVersion + 1;
    const createdAt = new Date();

    await this.contentStorage.save(
      id,
      newVersion,
      await updateContentInput.content,
    );
    await this.metadataStorage.save(id, title, newVersion, createdAt);

    return {
      id,
      title,
      url: `mock/${id}-${newVersion}`,
      version: newVersion,
      createdAt,
    };
  }

  // async resetVersion(resetContentInput: ResetContentInput): Promise<Content> {
  //   const { id, version } = resetContentInput;
  //   const metadata = await this.metadataStorage.findOne(id, version);

  //   if (!metadata) {
  //     throw new Error(`No content found with ID ${id} and version ${version}`);
  //   }

  //   await this.contentStorage.save(id, version);

  //   return {
  //     id,
  //     title: '', // Fetch or infer the title if needed
  //     url: `mock/${id}-${version}`,
  //     version,
  //     created_at: metadata.created_at,
  //   };
  // }
}
