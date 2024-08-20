import { Inject, Injectable } from '@nestjs/common';
import { drizzle } from 'drizzle-orm/node-postgres';
import { ContentVersion, Content } from '../entities/content.entity';
import { MetadataStorage } from '../interfaces/metadata-storage.interface';
import {
  CONTENT_TABLE,
  POSTGRES_CONNECTION,
} from 'src/database/postgres/postgres.providers';
import { content } from 'src/database/postgres/schema';
import { and, desc, eq } from 'drizzle-orm/expressions';

@Injectable()
export class PostgresMetadataStorage implements MetadataStorage {
  constructor(
    @Inject(POSTGRES_CONNECTION)
    private readonly connection: ReturnType<typeof drizzle>,
    @Inject(CONTENT_TABLE) private readonly table: typeof content,
  ) {}

  async save(
    id: string,
    title: string,
    version: number,
    createdAt: Date,
  ): Promise<void> {
    await this.connection.insert(this.table).values({
      id,
      title,
      version,
      createdAt,
    });
  }

  async findVersions(id: string): Promise<ContentVersion[]> {
    const rows = await this.connection
      .select()
      .from(this.table)
      .where(eq(this.table.id, id))
      .orderBy(desc(this.table.version));

    return rows.map((row) => ({
      version: row.version,
      createdAt: row.createdAt,
    }));
  }

  async latestVersion(id: string): Promise<number> {
    const row = await this.connection
      .select({ version: this.table.version })
      .from(this.table)
      .where(eq(this.table.id, id))
      .orderBy(desc(this.table.version))
      .limit(1);

    return row[0]?.version || 0;
  }

  async findOne(
    id: string,
    version: number,
  ): Promise<Partial<Content> | undefined> {
    const row = await this.connection
      .select()
      .from(this.table)
      .where(and(eq(this.table.id, id), eq(this.table.version, version)))
      .limit(1);

    if (!row.length) {
      return undefined;
    }

    return {
      id: row[0].id,
      title: row[0].title,
      version: row[0].version,
      createdAt: row[0].createdAt,
    };
  }
}
