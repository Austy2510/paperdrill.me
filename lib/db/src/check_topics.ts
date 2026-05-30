import { db, pool } from "./index";
import { questionsTable } from "./schema/questions";
import { count, isNull, eq, or } from "drizzle-orm";

async function main() {
  console.log("Checking topics in questions table...");
  
  // Count untagged (null or Uncategorized)
  const untaggedCount = await db
    .select({ val: count() })
    .from(questionsTable)
    .where(
      or(
        isNull(questionsTable.topic),
        eq(questionsTable.topic, "Uncategorized")
      )
    );
  
  console.log(`- Untagged / Uncategorized questions count: ${untaggedCount[0]?.val}`);

  // Count by topic
  const topicCounts = await db
    .select({
      topic: questionsTable.topic,
      count: count(),
    })
    .from(questionsTable)
    .groupBy(questionsTable.topic)
    .orderBy(count());

  console.log("\nTopics in DB:");
  topicCounts.forEach(t => {
    console.log(`  - "${t.topic}": ${t.count} questions`);
  });

  await pool.end();
}

main().catch(console.error);
