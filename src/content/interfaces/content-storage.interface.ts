export interface ContentStorage {
  save(id: string, version: number, payload: any): Promise<void>;
  findOne(id: string, version: number): Promise<string | undefined>;
}

export const CONTENT_STORAGE = Symbol.for('CONTENT_STORAGE');
