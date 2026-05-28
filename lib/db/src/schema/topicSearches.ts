import { pgTable, text, integer, primaryKey } from "drizzle-orm/pg-core";

export const topicSearchesTable = pgTable(
  "topic_searches",
  {
    subject: text("subject").notNull(),
    slug: text("slug").notNull(),
    searchCount: integer("search_count").notNull().default(0),
  },
  (t) => ({
    pk: primaryKey({ columns: [t.subject, t.slug] }),
  }),
);

export type TopicSearch = typeof topicSearchesTable.$inferSelect;
export type InsertTopicSearch = typeof topicSearchesTable.$inferInsert;
