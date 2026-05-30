import { db } from "./index";
import { questionsTable } from "./schema/questions";
import { isNull, and, or, eq } from "drizzle-orm";
import { anthropic } from "../../integrations-anthropic-ai/src/client";

async function main() {
  console.log("Starting AI Auto-Tagger for Past Paper Questions...");

  // Fetch untagged questions from the database
  const untagged = await db
    .select()
    .from(questionsTable)
    .where(
      or(
        isNull(questionsTable.topic),
        eq(questionsTable.topic, "Uncategorized")
      )
    )
    .limit(10); // Batch size

  if (untagged.length === 0) {
    console.log("No untagged questions found in the database. Everything is fully tagged!");
    return;
  }

  console.log(`Found ${untagged.length} untagged questions. Tagging with Claude AI...`);

  for (const q of untagged) {
    try {
      console.log(`Tagging Question ${q.questionNumber} from paper ${q.paperId} (${q.subject} - ${q.year})...`);
      
      const snippet = q.questionText.slice(0, 1500); // Send first 1500 chars to save tokens
      
      const response = await anthropic.messages.create({
        model: "claude-3-5-sonnet-20241022",
        max_tokens: 150,
        temperature: 0.1,
        system: "You are an expert exam question categorizer. Identify the academic subject topic and difficulty for the exam question text provided. Return ONLY a valid JSON object with 'topic' (a short 1-3 word specific topic like 'Organic Chemistry', 'Integration', 'Kinematics') and 'difficulty' (either 'Easy', 'Medium', or 'Hard'). Do not output any markdown or explanation.",
        messages: [
          {
            role: "user",
            content: `Subject: ${q.subject}\nQuestion Text:\n${snippet}`
          }
        ]
      });

      const text = response.content[0].type === "text" ? response.content[0].text : "";
      const cleaned = text.trim().replace(/^```json\s*/, "").replace(/\s*```$/, "");
      
      const parsed = JSON.parse(cleaned) as { topic: string; difficulty: string };
      console.log(`AI Result -> Topic: "${parsed.topic}" | Difficulty: "${parsed.difficulty}"`);

      // Update question in database
      await db
        .update(questionsTable)
        .set({
          topic: parsed.topic || "General",
          difficulty: parsed.difficulty || "Medium"
        })
        .where(eq(questionsTable.id, q.id));
        
    } catch (err) {
      console.error(`Failed to tag question ${q.id}:`, err);
    }
  }

  console.log("AI Auto-Tagger batch completed successfully!");
}

main().catch((err) => {
  console.error("Auto-Tagger crashed:", err);
  process.exit(1);
});
