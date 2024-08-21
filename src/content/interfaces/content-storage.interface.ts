import { File } from 'src/upload/file';

export interface ContentStorage {
  save(id: string, version: number, payload: File): Promise<void>;
  downloadUrl(id: string, version: number): Promise<string>;
  getOne(id: string, version: number): Promise<File | undefined>;
}

export const CONTENT_STORAGE = Symbol.for('CONTENT_STORAGE');
