import { readdir } from "node:fs/promises";
import { spawnSync } from "node:child_process";
import { join } from "node:path";

const build = spawnSync(process.execPath, ["scripts/build.mjs"], { stdio: "inherit" });
if (build.status !== 0) {
  process.exit(build.status ?? 1);
}
const tests = await findTests("dist");
if (tests.length === 0) {
  console.error("No compiled tests found");
  process.exit(1);
}
const result = spawnSync(process.execPath, ["--test", ...tests], { stdio: "inherit" });
process.exit(result.status ?? 1);

async function findTests(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const path = join(directory, entry.name);
    if (entry.isDirectory()) {
      files.push(...(await findTests(path)));
    } else if (entry.name.endsWith(".test.js")) {
      files.push(path);
    }
  }
  return files.sort();
}
