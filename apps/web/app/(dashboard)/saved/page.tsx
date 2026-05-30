import React from "react";
import { db, savedQuestionsTable, questionsTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import { getUserId } from "@/app/actions";
import SavedQuestionsList from "@/components/SavedQuestionsList";

export const dynamic = "force-dynamic";

export default async function SavedQuestionsPage() {
  const userId = await getUserId();

  // Fetch saved questions for this specific user
  const savedQuestions = await db
    .select({
      id: questionsTable.id,
      questionNumber: questionsTable.questionNumber,
      questionText: questionsTable.questionText,
      answerText: questionsTable.answerText,
      board: questionsTable.board,
      subject: questionsTable.subject,
      level: questionsTable.level,
      year: questionsTable.year,
      topic: questionsTable.topic,
    })
    .from(savedQuestionsTable)
    .innerJoin(questionsTable, eq(savedQuestionsTable.questionId, questionsTable.id))
    .where(eq(savedQuestionsTable.userId, userId));

  return <SavedQuestionsList initialQuestions={savedQuestions} />;
}
