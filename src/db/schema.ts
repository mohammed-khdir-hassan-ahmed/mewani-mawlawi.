import { integer, pgTable, varchar, index } from 'drizzle-orm/pg-core';

export const menuitem = pgTable('menuitem', {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  name_en: varchar('name_en', { length: 255 }).notNull(),
  name_ckb: varchar('name_ckb', { length: 255 }).notNull(),
  name_arb: varchar('name_arb', { length: 255 }),
  price: integer().notNull(),
  image_url: varchar({ length: 255 }).notNull(),
  category: varchar({ length: 50 }).notNull().default('main'),
}, (table) => [
  // Index for category filtering - CRITICAL for performance
  index('idx_menuitem_category').on(table.category),
  // Composite index for category + id lookups
  index('idx_menuitem_category_id').on(table.category, table.id),
  // Index for price sorting
  index('idx_menuitem_price').on(table.price),
]);
