import { pgTable, index, integer, varchar } from "drizzle-orm/pg-core"
import { sql } from "drizzle-orm"



export const menuitem = pgTable("menuitem", {
	id: integer().primaryKey().generatedAlwaysAsIdentity({ name: "menuitem_id_seq", startWith: 1, increment: 1, minValue: 1, maxValue: 2147483647, cache: 1 }),
	name: varchar({ length: 255 }).notNull(),
	price: integer().notNull(),
	imageUrl: varchar("image_url", { length: 255 }).notNull(),
	imageFileName: varchar("image_file_name", { length: 255 }),
	category: varchar({ length: 50 }).default('main').notNull(),
	nameEn: varchar("name_en", { length: 255 }),
	nameCkb: varchar("name_ckb", { length: 255 }),
}, (table) => [
	index("idx_menuitem_category").using("btree", table.category.asc().nullsLast().op("text_ops")),
	index("idx_menuitem_category_id").using("btree", table.category.asc().nullsLast().op("int4_ops"), table.id.asc().nullsLast().op("int4_ops")),
	index("idx_menuitem_price").using("btree", table.price.asc().nullsLast().op("int4_ops")),
]);
