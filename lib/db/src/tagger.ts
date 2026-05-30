import "./env"; // MUST BE FIRST to load env before drizzle connections are initialized
import { db } from "./index";
import { questionsTable } from "./schema/questions";
import { isNull, and, or, eq } from "drizzle-orm";

const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;

async function main() {
  console.log("Starting AI Auto-Tagger for Past Paper Questions...");

  if (!OPENROUTER_API_KEY) {
    console.error("Error: OPENROUTER_API_KEY is not defined in environment variables!");
    process.exit(1);
  }

  // Fetch untagged questions from the database (up to 500 per run to prevent overloading)
  const untagged = await db
    .select()
    .from(questionsTable)
    .where(
      or(
        isNull(questionsTable.topic),
        eq(questionsTable.topic, "Uncategorized")
      )
    )
    .limit(500);

  if (untagged.length === 0) {
    console.log("No untagged questions found in the database. Everything is fully tagged!");
    return;
  }

  console.log(`Found ${untagged.length} untagged questions. Tagging with DeepSeek via OpenRouter...`);

  let successCount = 0;

  for (const q of untagged) {
    try {
      console.log(`[${successCount + 1}/${untagged.length}] Tagging Q${q.questionNumber} for paper ${q.paperId} (${q.subject} - ${q.year})...`);
      
      const snippet = q.questionText.slice(0, 1500); // Send first 1500 chars to save tokens
      
      const payload = {
        model: "deepseek/deepseek-chat",
        messages: [
          {
            role: "system",
            content: "You are an expert exam question categorizer. Identify the academic subject topic and difficulty for the exam question text provided. Return ONLY a valid JSON object with 'topic' (a short 1-3 word specific topic like 'Organic Chemistry', 'Integration', 'Kinematics') and 'difficulty' (either 'Easy', 'Medium', or 'Hard'). Do not output any markdown or explanation."
          },
          {
            role: "user",
            content: `Subject: ${q.subject}\nQuestion Text:\n${snippet}`
          }
        ],
        temperature: 0.1,
        response_format: { type: "json_object" }
      };

      const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${OPENROUTER_API_KEY}`,
          "HTTP-Referer": "https://paperdrill.me",
          "X-Title": "PaperDrill Auto-Tagger"
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        throw new Error(`OpenRouter returned status ${response.status}`);
      }

      const data = await response.json() as any;
      const text = data.choices?.[0]?.message?.content || "";
      const cleaned = text.trim().replace(/^```json\s*/, "").replace(/\s*```$/, "");
      
      const parsed = JSON.parse(cleaned) as { topic: string; difficulty: string };
      console.log(`   -> Topic: "${parsed.topic}" | Difficulty: "${parsed.difficulty}"`);

      // Update question in database
      await db
        .update(questionsTable)
        .set({
          topic: parsed.topic || "General",
          difficulty: parsed.difficulty || "Medium"
        })
        .where(eq(questionsTable.id, q.id));

      successCount++;
      
      // Small rate-limit delay
      await new Promise((resolve) => setTimeout(resolve, 300));
        
    } catch (err) {
      console.error(`Failed to tag question ${q.id}:`, err);
    }
  }

  console.log(`AI Auto-Tagger batch completed successfully! Successfully tagged ${successCount} questions.`);
}

main().catch((err) => {
  console.error("Auto-Tagger crashed:", err);
  process.exit(1);
});
