import { createDiagnosticsBundle, writeDiagnosticsBundle } from "./index.js";
import { createDeterministicHarness } from "../../test-harness/src/index.js";

const harness = createDeterministicHarness();
const health = {
  status: "ok" as const,
  service: "sol-fabric" as const,
  version: "0.1.0",
  obs: "mock" as const,
  phone: "simulated" as const,
};
const outputPath = await writeDiagnosticsBundle(createDiagnosticsBundle(harness.room.getState(), health));
console.log(outputPath);
