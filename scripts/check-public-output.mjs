import fs from "node:fs";
import path from "node:path";
import process from "node:process";

const root = process.cwd();
const scanRoots = ["dist", "src/content"].map((entry) => path.join(root, entry));
const forbiddenPhrases = [
  ["", "Users", "ricokahler"].join("/"),
  ["sources", "transcripts"].join("/"),
  ["just", "energy", "book"].join("-"),
  [".codex", "attachments"].join("/"),
  ["workspace", ["just", "energy", "book"].join("-")].join("/"),
  "pasted-text.txt",
  "CleanShot 2026"
];

const forbidden = forbiddenPhrases.map(
  (phrase) => new RegExp(phrase.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "g")
);

const textExtensions = new Set([
  ".html",
  ".css",
  ".js",
  ".mjs",
  ".json",
  ".xml",
  ".txt",
  ".md",
  ".mdx"
]);

function walk(dir) {
  if (!fs.existsSync(dir)) return [];
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  return entries.flatMap((entry) => {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) return walk(fullPath);
    return [fullPath];
  });
}

const failures = [];

for (const filePath of scanRoots.flatMap(walk)) {
  if (!textExtensions.has(path.extname(filePath))) continue;
  const text = fs.readFileSync(filePath, "utf8");
  for (const pattern of forbidden) {
    pattern.lastIndex = 0;
    if (pattern.test(text)) {
      failures.push(`${path.relative(root, filePath)} matched ${pattern}`);
    }
  }
}

if (failures.length > 0) {
  console.error("Public output check failed:");
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log("Public output check passed.");
