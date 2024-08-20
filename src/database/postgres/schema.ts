import {
  integer,
  pgTable,
  primaryKey,
  timestamp,
  varchar,
} from 'drizzle-orm/pg-core';

export const content = pgTable(
  'content',
  {
    id: varchar('id', { length: 36 }),
    title: varchar('title'),
    version: integer('version'),
    createdAt: timestamp('created_at'),
  },
  (table) => {
    return {
      pk: primaryKey({ columns: [table.id, table.version] }),
    };
  },
);
