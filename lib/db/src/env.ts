import fs from "fs";
import path from "path";

// Load environment variables natively relative to workspace root (lib/db)
try {
  // D:\Exam-Vault\Exam-Vault\lib\db is the package directory
  // D:\Exam-Vault\Exam-Vault is the repo root
  const rootEnv = path.resolve(__dirname, "../../.env");
  const webEnv = path.resolve(__dirname, "../../apps/web/.env.local");

  if (fs.existsSync(rootEnv)) {
    process.loadEnvFile(rootEnv);
  }
  if (fs.existsSync(webEnv)) {
    process.loadEnvFile(webEnv);
  }
} catch (e) {
  // Fallback to relative paths without __dirname since ES Modules might not define it
  try {
    if (fs.existsSync("../.env")) {
      process.loadEnvFile("../.env");
    } else if (fs.existsSync("../../.env")) {
      process.loadEnvFile("../../.env");
    }
    
    if (fs.existsSync("../apps/web/.env.local")) {
      process.loadEnvFile("../apps/web/.env.local");
    } else if (fs.existsSync("../../apps/web/.env.local")) {
      process.loadEnvFile("../../apps/web/.env.local");
    }
  } catch (err) {
    console.warn("Notice: Env loader skipped in relative fallback:", err);
  }
}
