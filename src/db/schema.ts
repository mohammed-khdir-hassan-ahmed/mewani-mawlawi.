import { integer, pgTable, varchar } from 'drizzle-orm/pg-core';

export const menuitem = pgTable('menuitem', {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  name: varchar({ length: 255 }).notNull(),
  price: integer().notNull(),
  image_url: varchar({ length: 255 }).notNull(),
  category: varchar({ length: 50 }).notNull().default('main'),
});
