#!/usr/bin/env node
// Tracks which source files changed since documentation was last generated.
// Usage (from project root):
//   node .claude/skills/document-project/scripts/doc-state.mjs status
//   node .claude/skills/document-project/scripts/doc-state.mjs save

import { createHash } from "node:crypto";
import { existsSync, mkdirSync, readFileSync, readdirSync, writeFileSync } from "node:fs";
import { extname, join, relative, sep } from "node:path";

const ROOT = process.cwd();
const STATE_FILE = join(ROOT, "docs", ".doc-state.json");

const IGNORE_DIRS = new Set([
  "node_modules", ".next", ".git", ".claude", "docs", "dist", "build", "out",
  "coverage", ".turbo", ".vercel", ".venv", "venv", "__pycache__", "site",
]);
const IGNORE_FILES = new Set([
  "package-lock.json", "yarn.lock", "pnpm-lock.yaml", "bun.lockb",
  "next-env.d.ts", ".DS_Store",
]);
const IGNORE_EXT = new Set([
  ".png", ".jpg", ".jpeg", ".gif", ".webp", ".ico", ".svg", ".woff", ".woff2",
  ".ttf", ".eot", ".mp4", ".mp3", ".pdf", ".zip", ".tsbuildinfo", ".map",
]);
// Root-level markdown is docs or notes, not source.
const isRootMarkdown = (rel) => !rel.includes("/") && extname(rel).toLowerCase() === ".md";

function walk(dir, out = []) {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) {
      if (!IGNORE_DIRS.has(entry.name)) walk(full, out);
    } else if (entry.isFile()) {
      const rel = relative(ROOT, full).split(sep).join("/");
      if (IGNORE_FILES.has(entry.name)) continue;
      if (IGNORE_EXT.has(extname(entry.name).toLowerCase())) continue;
      if (isRootMarkdown(rel)) continue;
      out.push(rel);
    }
  }
  return out;
}

function snapshot() {
  const hashes = {};
  for (const rel of walk(ROOT).sort()) {
    hashes[rel] = createHash("sha256").update(readFileSync(join(ROOT, rel))).digest("hex").slice(0, 16);
  }
  return hashes;
}

const cmd = process.argv[2];
const current = snapshot();

if (cmd === "save") {
  mkdirSync(join(ROOT, "docs"), { recursive: true });
  writeFileSync(
    STATE_FILE,
    JSON.stringify({ updatedAt: new Date().toISOString(), files: current }, null, 2) + "\n",
  );
  console.log(`Saved doc state for ${Object.keys(current).length} files to docs/.doc-state.json`);
} else if (cmd === "status") {
  const files = Object.keys(current);
  if (!existsSync(STATE_FILE)) {
    const docsExist = existsSync(join(ROOT, "docs")) &&
      readdirSync(join(ROOT, "docs")).some((f) => f.endsWith(".md"));
    console.log(JSON.stringify({
      mode: docsExist ? "update" : "create",
      note: docsExist
        ? "docs/ exists but has no saved state; treat every file as possibly changed and review all pages"
        : "no documentation found",
      files,
      changed: docsExist ? files : [],
      added: [],
      removed: [],
    }, null, 2));
  } else {
    const prev = JSON.parse(readFileSync(STATE_FILE, "utf8"));
    const old = prev.files ?? {};
    console.log(JSON.stringify({
      mode: "update",
      lastDocumented: prev.updatedAt,
      files,
      changed: files.filter((f) => f in old && old[f] !== current[f]),
      added: files.filter((f) => !(f in old)),
      removed: Object.keys(old).filter((f) => !(f in current)),
    }, null, 2));
  }
} else {
  console.error("Usage: doc-state.mjs <status|save>");
  process.exit(1);
}
