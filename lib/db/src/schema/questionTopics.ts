import { pgTable, uuid, text, primaryKey } from "drizzle-orm/pg-core";
import { questionsTable } from "./questions";
import { topicsTable } from "./topics";

export const questionTopicsTable = pgTable(
  "question_topics",
  {
    questionId: uuid("question_id")
      .notNull()
      .references(() => questionsTable.id, { onDelete: "cascade" }),
    topicSubject: text("topic_subject").notNull(),
    topicSlug: text("topic_slug").notNull(),
  },
  (t) => ({
    pk: primaryKey({ columns: [t.questionId, t.topicSubject, t.topicSlug] }),
  }),
);

export type QuestionTopic = typeof questionTopicsTable.$inferSelect;
export type InsertQuestionTopic = typeof questionTopicsTable.$inferInsert;
