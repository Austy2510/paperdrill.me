import { pgTable, text, integer } from "drizzle-orm/pg-core";

export const boardsTable = pgTable("boards", {
  code: text("code").primaryKey(),
  name: text("name").notNull(),
  region: text("region").notNull(),
  description: text("description"),
  levels: text("levels").array().notNull().default([]),
  sortOrder: integer("sort_order").notNull().default(0),
});

export type Board = typeof boardsTable.$inferSelect;
export type InsertBoard = typeof boardsTable.$inferInsert;
