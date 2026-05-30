"use server";

import { db, savedQuestionsTable } from "@workspace/db";
import { eq, and } from "drizzle-orm";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

export async function toggleSavedQuestion(questionId: string) {
  let userId: string | null = null;
  try {
    const authData = await auth();
    userId = authData.userId;
  } catch (err) {
    console.log("Clerk auth failed/bypassed in toggleSavedQuestion. Using mock_dev_user.");
  }

  if (!userId) {
    if (process.env.NODE_ENV === "production") {
      throw new Error("Unauthorized");
    }
    userId = "mock_dev_user";
  }

  // Check if already saved
  const existing = await db
    .select()
    .from(savedQuestionsTable)
    .where(
      and(
        eq(savedQuestionsTable.userId, userId),
        eq(savedQuestionsTable.questionId, questionId)
      )
    )
    .limit(1);

  if (existing.length > 0) {
    // Unsave
    await db
      .delete(savedQuestionsTable)
      .where(
        and(
          eq(savedQuestionsTable.userId, userId),
          eq(savedQuestionsTable.questionId, questionId)
        )
      );
    revalidatePath("/saved");
    return { saved: false };
  } else {
    // Save
    await db.insert(savedQuestionsTable).values({
      userId,
      questionId,
    });
    revalidatePath("/saved");
    return { saved: true };
  }
}

export async function getSavedQuestionStatus(questionId: string) {
  let userId: string | null = null;
  try {
    const authData = await auth();
    userId = authData.userId;
  } catch (err) {
    if (process.env.NODE_ENV !== "production") {
      userId = "mock_dev_user";
    }
  }
  if (!userId) return false;

  const existing = await db
    .select()
    .from(savedQuestionsTable)
    .where(
      and(
        eq(savedQuestionsTable.userId, userId),
        eq(savedQuestionsTable.questionId, questionId)
      )
    )
    .limit(1);

  return existing.length > 0;
}

export async function clearAllSavedQuestions() {
  let userId: string | null = null;
  try {
    const authData = await auth();
    userId = authData.userId;
  } catch (err) {
    console.log("Clerk auth failed/bypassed in clearAllSavedQuestions. Using mock_dev_user.");
  }

  if (!userId) {
    if (process.env.NODE_ENV === "production") {
      throw new Error("Unauthorized");
    }
    userId = "mock_dev_user";
  }

  await db
    .delete(savedQuestionsTable)
    .where(eq(savedQuestionsTable.userId, userId));

  revalidatePath("/saved");
}

