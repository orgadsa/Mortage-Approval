import { MortgageApplication } from "@/types";
import fs from "fs";
import path from "path";

const DATA_DIR = path.join(process.cwd(), "data");
const JSON_PATH = path.join(DATA_DIR, "applications.json");

function ensureDataDir() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
}

function readExisting(): Array<MortgageApplication & { submissionDate: string }> {
  if (!fs.existsSync(JSON_PATH)) return [];
  try {
    const raw = fs.readFileSync(JSON_PATH, "utf-8");
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

export async function saveApplicationToJson(
  application: MortgageApplication
): Promise<string> {
  ensureDataDir();

  const submissionDate = new Date().toISOString();
  const entry = { submissionDate, ...application };

  const existing = readExisting();
  existing.push(entry);

  fs.writeFileSync(JSON_PATH, JSON.stringify(existing, null, 2), "utf-8");

  return submissionDate;
}
