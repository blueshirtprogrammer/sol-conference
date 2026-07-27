import { mkdir, writeFile } from "node:fs/promises";
import { arch, platform, release } from "node:os";
import { versions } from "node:process";
import { resolve } from "node:path";
import type { HealthStatus, RoomState } from "../../contracts/src/index.js";

export interface DiagnosticsBundle {
  readonly generatedAt: string;
  readonly runtime: {
    readonly node: string;
    readonly platform: string;
    readonly release: string;
    readonly arch: string;
  };
  readonly health: HealthStatus;
  readonly room: RoomState;
  readonly evidence: {
    readonly hardwareVerified: false;
    readonly note: string;
  };
}

export function createDiagnosticsBundle(room: RoomState, health: HealthStatus): DiagnosticsBundle {
  return {
    generatedAt: new Date().toISOString(),
    runtime: {
      node: versions.node,
      platform: platform(),
      release: release(),
      arch: arch(),
    },
    health,
    room,
    evidence: {
      hardwareVerified: false,
      note: "Phase 0B simulator evidence only; no Phone Link or live audio behaviour is asserted.",
    },
  };
}

export async function writeDiagnosticsBundle(
  bundle: DiagnosticsBundle,
  outputDirectory = "artifacts/diagnostics",
): Promise<string> {
  const directory = resolve(outputDirectory);
  await mkdir(directory, { recursive: true });
  const safeTimestamp = bundle.generatedAt.replaceAll(":", "-");
  const outputPath = resolve(directory, `sol-room-diagnostics-${safeTimestamp}.json`);
  await writeFile(outputPath, `${JSON.stringify(bundle, null, 2)}\n`, "utf8");
  return outputPath;
}
