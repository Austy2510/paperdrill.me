import {
  pgTable,
  text,
  integer,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";

export const papersTable = pgTable("papers", {
  id: uuid("id").primaryKey().defaultRandom(),
  board: text("board").notNull(),
  subject: text("subject").notNull(),
  level: text("level").notNull(),
  year: integer("year").notNull(),
  paperNumber: text("paper_number").notNull(),
  paperType: text("paper_type"),
  durationMinutes: integer("duration_minutes"),
  sourcePdfUrl: text("source_pdf_url"),
  markSchemeUrl: text("mark_scheme_url"),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export type Paper = typeof papersTable.$inferSelect;
export type InsertPaper = typeof papersTable.$inferInsert;
