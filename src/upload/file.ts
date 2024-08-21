import { Readable } from 'stream';

export class File {
  constructor(
    public readonly mimetype: string,
    public readonly uploadStream: Readable,
  ) {}
}
