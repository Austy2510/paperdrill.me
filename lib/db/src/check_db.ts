import "./env";
import { db, pool } from "./index";
import { papersTable } from "./schema/papers";
import { questionsTable } from "./schema/questions";
import { count } from "drizzle-orm";

async function main() {
  console.log("Checking Neon Postgres database status...");
  
  try {
    const papersCount = await db.select({ val: count() }).from(papersTable);
    console.log(`- Papers count: ${papersCount[0]?.val}`);
  } catch (err: any) {
    console.log("- Error reading papers table (might not exist):", err?.message || err);
  }

  try {
    const questionsCount = await db.select({ val: count() }).from(questionsTable);
    console.log(`- Questions count: ${questionsCount[0]?.val}`);
    
    if (questionsCount[0]?.val > 0) {
      const sample = await db.select().from(questionsTable).limit(3);
      console.log("\nSample Questions:");
      sample.forEach(q => {
        console.log(`  [${q.board}] ${q.subject} (${q.year}) Q${q.questionNumber} Topic: "${q.topic}" Difficulty: "${q.difficulty}"`);
      });
    }
  } catch (err: any) {
    console.log("- Error reading questions table (might not exist):", err?.message || err);
  }

  await pool.end();
}

main().catch(console.error);
