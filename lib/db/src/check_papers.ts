import { db, pool } from "./index";
import { papersTable } from "./schema/papers";
import { desc } from "drizzle-orm";

async function main() {
  console.log("Checking raw rows in 'papers' table...");
  try {
    const papers = await db.select().from(papersTable).orderBy(desc(papersTable.createdAt)).limit(10);
    console.log(JSON.stringify(papers, null, 2));
  } catch (err) {
    console.error("Error reading papers:", err);
  }
  await pool.end();
}

main().catch(console.error);
