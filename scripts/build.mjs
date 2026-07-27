import { cp, mkdir, rm } from "node:fs/promises";
import { existsSync } from "node:fs";
import { spawnSync } from "node:child_process";

await rm("dist", { recursive: true, force: true });
const result = spawnSync("tsc", ["--project", "tsconfig.json"], { stdio: "inherit", shell: process.platform === "win32" });
if (result.status !== 0) {
  process.exit(result.status ?? 1);
}
await mkdir("dist/apps/sol-room-web", { recursive: true });
await cp("apps/sol-room-web/public", "dist/apps/sol-room-web/public", { recursive: true });
await mkdir("dist/apps/sol-obs-bridge", { recursive: true });
await cp("apps/sol-obs-bridge/scenes", "dist/apps/sol-obs-bridge/scenes", { recursive: true });
await cp("apps/sol-obs-bridge/overlays", "dist/apps/sol-obs-bridge/overlays", { recursive: true });
if (existsSync("website/index.html") && existsSync("scripts/validate-site.mjs")) {
  const site = spawnSync(process.execPath, ["scripts/validate-site.mjs"], { stdio: "inherit" });
  if (site.status !== 0) {
    process.exit(site.status ?? 1);
  }
}
console.log("Phase 0B build complete");
