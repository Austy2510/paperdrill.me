"use server";

import { db, savedQuestionsTable } from "@workspace/db";
import { eq, and } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";

async function getUserId() {
  const cookieStore = await cookies();
  const deviceId = cookieStore.get("deviceId")?.value;
  return deviceId || "anonymous_user";
}

export async function toggleSavedQuestion(questionId: string) {
  const userId = await getUserId();

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
  const userId = await getUserId();

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
  const userId = await getUserId();

  await db
    .delete(savedQuestionsTable)
    .where(eq(savedQuestionsTable.userId, userId));

  revalidatePath("/saved");
}

export async function logTelemetry(eventType: string, eventData?: string, location?: string, ipAddress?: string) {
  const userId = await getUserId();
  
  try {
    await db.insert(telemetryTable).values({
      deviceId: userId,
      eventType,
      eventData: eventData || null,
      location: location || null,
      ipAddress: ipAddress || null,
    });
  } catch (error) {
    console.error("Failed to log telemetry:", error);
  }
}

