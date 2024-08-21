import { Content, ContentVersion } from '../entities/content.entity';

export interface MetadataStorage {
  save(
    id: string,
    version: number,
    createdAt: Date,
    title?: string,
  ): Promise<Content>;
  findVersions(
    id: string,
    limit: number,
    skip: number,
  ): Promise<ContentVersion[]>;
  latestVersion(id: string): Promise<number>;
  findOne(id: string, version?: number): Promise<Partial<Content> | undefined>;
}

export const METADATA_STORAGE = Symbol.for('METADATA_STORAGE');
