import React from "react";
import { db, savedQuestionsTable, questionsTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import SavedQuestionsList from "@/components/SavedQuestionsList";

export const dynamic = "force-dynamic";

export default async function SavedQuestionsPage() {
  let userId: string | null = null;
  try {
    const authData = await auth();
    userId = authData.userId;
  } catch (err) {
    if (process.env.NODE_ENV !== "production") {
      userId = "mock_dev_user";
    }
  }

  if (!userId) {
    redirect("/sign-in");
  }

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
