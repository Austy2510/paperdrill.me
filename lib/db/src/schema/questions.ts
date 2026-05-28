import {
  pgTable,
  text,
  integer,
  timestamp,
  uuid,
  index,
} from "drizzle-orm/pg-core";

export const questionsTable = pgTable(
  "questions",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    paperId: uuid("paper_id").notNull(),
    board: text("board").notNull(),
    subject: text("subject").notNull(),
    level: text("level").notNull(),
    year: integer("year").notNull(),
    paperNumber: text("paper_number").notNull(),
    paperType: text("paper_type"),
    questionNumber: text("question_number").notNull(),
    questionText: text("question_text").notNull(),
    answerText: text("answer_text").notNull(),
    topic: text("topic"),
    marks: integer("marks"),
    difficulty: text("difficulty"),
    sourcePdfUrl: text("source_pdf_url"),
    markSchemeUrl: text("mark_scheme_url"),
    featured: integer("featured").notNull().default(0),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (t) => ({
    boardIdx: index("questions_board_idx").on(t.board),
    subjectIdx: index("questions_subject_idx").on(t.subject),
    yearIdx: index("questions_year_idx").on(t.year),
    topicIdx: index("questions_topic_idx").on(t.topic),
  }),
);

export type Question = typeof questionsTable.$inferSelect;
export type InsertQuestion = typeof questionsTable.$inferInsert;
