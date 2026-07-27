import { spawn } from "node:child_process";

const build = spawn(process.execPath, ["scripts/build.mjs"], { stdio: "inherit" });
build.on("exit", (code) => {
  if (code !== 0) process.exit(code ?? 1);
  const service = spawn(process.execPath, ["dist/apps/sol-fabric-service/src/server.js"], {
    stdio: "inherit",
    env: process.env,
  });
  service.on("exit", (serviceCode) => process.exit(serviceCode ?? 0));
});
