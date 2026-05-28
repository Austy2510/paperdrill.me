import { pgTable, text, primaryKey } from "drizzle-orm/pg-core";

export const topicsTable = pgTable(
  "topics",
  {
    slug: text("slug").notNull(),
    subject: text("subject").notNull(),
    name: text("name").notNull(),
  },
  (t) => ({
    pk: primaryKey({ columns: [t.subject, t.slug] }),
  }),
);

export type Topic = typeof topicsTable.$inferSelect;
export type InsertTopic = typeof topicsTable.$inferInsert;
