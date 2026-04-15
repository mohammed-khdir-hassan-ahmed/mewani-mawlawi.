import { integer, pgTable, varchar } from "drizzle-orm/pg-core";


export const menuitem = pgTable("menuitem", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  name_en: varchar({ length: 255 }),
  name_ckb: varchar({ length: 255 }),
  price: integer().notNull(),
  image_url: varchar({ length: 255 }).notNull(),
});
