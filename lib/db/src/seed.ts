import { db, pool } from "./index";
import { papersTable } from "./schema/papers";
import { questionsTable } from "./schema/questions";
import { subjectsTable } from "./schema/subjects";
import { boardsTable } from "./schema/boards";

async function main() {
  console.log("Seeding database...");

  // Seed Boards
  const boardsData = [
    { code: "CAIE", name: "Cambridge Assessment International Education", region: "International" },
    { code: "Edexcel", name: "Pearson Edexcel", region: "International" },
    { code: "AQA", name: "AQA", region: "UK" },
    { code: "IB", name: "International Baccalaureate", region: "International" },
    { code: "Dhaka", name: "Dhaka Board", region: "Bangladesh" }
  ];
  
  await db.insert(boardsTable).values(boardsData).onConflictDoNothing();

  // Seed Subjects
  const subjectsData = [
    { slug: "chemistry", name: "Chemistry" },
    { slug: "physics", name: "Physics" },
    { slug: "mathematics", name: "Mathematics" },
    { slug: "biology", name: "Biology" },
  ];

  await db.insert(subjectsTable).values(subjectsData).onConflictDoNothing();

  // Seed Papers
  const papersData = [
    { board: "Edexcel", subject: "Chemistry", level: "IAL", year: 2023, paperNumber: "1C" },
    { board: "CAIE", subject: "Physics", level: "A Level", year: 2022, paperNumber: "P1" },
    { board: "Edexcel", subject: "Mathematics", level: "GCSE", year: 2023, paperNumber: "H1" },
  ];

  const insertedPapers = await db.insert(papersTable).values(papersData).returning();

  // Seed Questions
  const questionsData = insertedPapers.map((paper, index) => ({
    paperId: paper.id,
    board: paper.board,
    subject: paper.subject,
    level: paper.level,
    year: paper.year,
    paperNumber: paper.paperNumber,
    questionNumber: `Q${index + 1}`,
    questionText: `This is a sample question for ${paper.subject} from ${paper.year}.`,
    answerText: `This is the detailed explanation and answer for Q${index + 1}.`,
    marks: 5,
    difficulty: "Medium",
    topic: "Core Concepts",
  }));

  await db.insert(questionsTable).values(questionsData).onConflictDoNothing();

  console.log("Database seeded successfully!");
  
  // Close pool
  await pool.end();
}

main().catch((err) => {
  console.error("Error seeding database:", err);
  process.exit(1);
});
