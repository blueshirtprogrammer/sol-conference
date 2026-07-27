import { readFile, readdir } from "node:fs/promises";
import { extname, join } from "node:path";
import { spawnSync } from "node:child_process";

const roots = ["apps", "packages", "scripts"];
const failures = [];
for (const root of roots) {
  for (const file of await walk(root)) {
    if (![".ts", ".js", ".mjs", ".css", ".html"].includes(extname(file))) continue;
    const text = await readFile(file, "utf8");
    const lines = text.split("\n");
    lines.forEach((line, index) => {
      if (/\s+$/.test(line) && line.length > 0) failures.push(`${file}:${index + 1}: trailing whitespace`);
      if (line.includes("\t")) failures.push(`${file}:${index + 1}: tab character`);
    });
  }
}
for (const file of (await walk("scripts")).filter((path) => path.endsWith(".mjs"))) {
  const check = spawnSync(process.execPath, ["--check", file], { encoding: "utf8" });
  if (check.status !== 0) failures.push(`${file}: ${check.stderr.trim()}`);
}
if (failures.length > 0) {
  console.error(failures.join("\n"));
  process.exit(1);
}
console.log("Lint checks passed");

async function walk(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const path = join(directory, entry.name);
    if (entry.isDirectory()) files.push(...(await walk(path)));
    else files.push(path);
  }
  return files;
}
