import { pgTable, text, uuid, index } from "drizzle-orm/pg-core";

export const syllabusObjectivesTable = pgTable(
  "syllabus_objectives",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    board: text("board").notNull(),
    subject: text("subject").notNull(),
    objectiveCode: text("objective_code").notNull(),
    description: text("description").notNull(),
    topicSlug: text("topic_slug"), // Optional link to a topic
  },
  (t) => ({
    boardSubjectIdx: index("syllabus_board_subject_idx").on(t.board, t.subject),
    codeIdx: index("syllabus_code_idx").on(t.objectiveCode),
  }),
);

export type SyllabusObjective = typeof syllabusObjectivesTable.$inferSelect;
export type InsertSyllabusObjective = typeof syllabusObjectivesTable.$inferInsert;
