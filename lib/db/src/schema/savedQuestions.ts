import {
  pgTable,
  text,
  timestamp,
  uuid,
  index,
  unique,
} from "drizzle-orm/pg-core";
import { questionsTable } from "./questions";

export const savedQuestionsTable = pgTable(
  "saved_questions",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: text("user_id").notNull(),
    questionId: uuid("question_id")
      .notNull()
      .references(() => questionsTable.id, { onDelete: "cascade" }),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (t) => ({
    userIdIdx: index("saved_questions_user_id_idx").on(t.userId),
    uniqueUserQuestion: unique("saved_questions_user_question_uniq").on(t.userId, t.questionId),
  })
);

export type SavedQuestion = typeof savedQuestionsTable.$inferSelect;
export type InsertSavedQuestion = typeof savedQuestionsTable.$inferInsert;
