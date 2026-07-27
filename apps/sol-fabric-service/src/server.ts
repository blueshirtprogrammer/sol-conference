import { createHash } from "node:crypto";
import { createReadStream } from "node:fs";
import { stat } from "node:fs/promises";
import { createServer } from "node:http";
import type { IncomingMessage, ServerResponse } from "node:http";
import { extname, resolve } from "node:path";
import type { Duplex } from "node:stream";
import { fileURLToPath } from "node:url";
import type { HealthStatus, RoomState } from "../../../packages/contracts/src/index.js";
import { handleSemanticCommand, parseSemanticCommand, synchronizeObsFromRoom } from "../../../packages/command-policy/src/index.js";
import { createDiagnosticsBundle } from "../../../packages/diagnostics/src/index.js";
import { MockObsAdapter, ObsWebSocketAdapter } from "../../../packages/obs-adapter/src/index.js";
import type { ObsAdapter } from "../../../packages/obs-adapter/src/index.js";
import { DeterministicPhoneAdapter } from "../../../packages/phone-link-adapter/src/index.js";
import { createDeterministicRoomStore } from "../../../packages/room-state/src/index.js";

const version = "0.1.0";
const port = Number(process.env["SOL_FABRIC_PORT"] ?? 4317);
const webRoot = resolve(fileURLToPath(new URL("../../sol-room-web/public", import.meta.url)));
const room = createDeterministicRoomStore();
const phone = new DeterministicPhoneAdapter();
const obs = createObsAdapter();
const sockets = new Set<Duplex>();


const server = createServer(async (request, response) => {
  try {
    await handleRequest(request, response);
  } catch (error) {
    writeJson(response, 500, { error: error instanceof Error ? error.message : String(error) });
  }
});

server.on("upgrade", (request, socket) => {
  if (request.url !== "/ws") {
    socket.destroy();
    return;
  }
  const key = request.headers["sec-websocket-key"];
  if (typeof key !== "string") {
    socket.destroy();
    return;
  }
  const accept = createHash("sha1")
    .update(`${key}258EAFA5-E914-47DA-95CA-C5AB0DC85B11`)
    .digest("base64");
  socket.write(
    "HTTP/1.1 101 Switching Protocols\r\n" +
      "Upgrade: websocket\r\n" +
      "Connection: Upgrade\r\n" +
      `Sec-WebSocket-Accept: ${accept}\r\n\r\n`,
  );
  sockets.add(socket);
  socket.on("close", () => sockets.delete(socket));
  socket.on("error", () => sockets.delete(socket));
  socket.write(encodeTextFrame(JSON.stringify({ type: "room.state", room: room.getState() })));
});

room.subscribe((state) => broadcast(state));

server.listen(port, "127.0.0.1", () => {
  console.log(`Sol Fabric listening on http://127.0.0.1:${port}`);
  console.log(`OBS adapter: ${obs.kind}; phone adapter: simulator`);
});

async function handleRequest(request: IncomingMessage, response: ServerResponse): Promise<void> {
  const method = request.method ?? "GET";
  const url = new URL(request.url ?? "/", `http://${request.headers.host ?? "127.0.0.1"}`);

  if (method === "GET" && url.pathname === "/health") {
    writeJson(response, 200, await healthStatus());
    return;
  }
  if (method === "GET" && url.pathname === "/api/room") {
    writeJson(response, 200, room.getState());
    return;
  }
  if (method === "GET" && url.pathname === "/api/diagnostics") {
    writeJson(response, 200, createDiagnosticsBundle(room.getState(), await healthStatus()));
    return;
  }
  if (method === "POST" && url.pathname === "/api/commands") {
    const payload = await readJsonBody(request);
    const command = parseSemanticCommand(payload);
    const result = await handleSemanticCommand({ room, obs, phone }, command);
    writeJson(response, result.ok ? 200 : 409, result);
    return;
  }
  if (method === "GET") {
    await serveStatic(url.pathname, response);
    return;
  }
  writeJson(response, 404, { error: "Not found" });
}

async function healthStatus(): Promise<HealthStatus> {
  let obsStatus: HealthStatus["obs"] = obs.kind === "mock" ? "mock" : "disconnected";
  try {
    await synchronizeObsFromRoom(obs, room.getState());
    obsStatus = obs.kind === "mock" ? "mock" : "connected";
  } catch {
    obsStatus = "disconnected";
  }
  const phoneStatus = await phone.getStatus();
  return {
    status: obsStatus === "disconnected" ? "degraded" : "ok",
    service: "sol-fabric",
    version,
    obs: obsStatus,
    phone: phoneStatus.simulated ? "simulated" : phoneStatus.connection,
  };
}

function createObsAdapter(): ObsAdapter {
  if (process.env["SOL_OBS_MODE"] !== "websocket") {
    return new MockObsAdapter();
  }
  return new ObsWebSocketAdapter({
    url: process.env["OBS_WEBSOCKET_URL"] ?? "ws://127.0.0.1:4455",
    ...(process.env["OBS_WEBSOCKET_PASSWORD"] === undefined
      ? {}
      : { password: process.env["OBS_WEBSOCKET_PASSWORD"] }),
  });
}

function broadcast(state: RoomState): void {
  const frame = encodeTextFrame(JSON.stringify({ type: "room.state", room: state }));
  for (const socket of sockets) {
    if (socket.destroyed) {
      sockets.delete(socket);
      continue;
    }
    socket.write(frame);
  }
}

function encodeTextFrame(text: string): Buffer {
  const payload = Buffer.from(text, "utf8");
  if (payload.length < 126) {
    return Buffer.concat([Buffer.from([0x81, payload.length]), payload]);
  }
  if (payload.length <= 0xffff) {
    const header = Buffer.alloc(4);
    header[0] = 0x81;
    header[1] = 126;
    header.writeUInt16BE(payload.length, 2);
    return Buffer.concat([header, payload]);
  }
  throw new Error("WebSocket payload exceeds Phase 0B limit");
}

async function readJsonBody(request: IncomingMessage): Promise<unknown> {
  const chunks: Buffer[] = [];
  let total = 0;
  for await (const chunk of request) {
    const buffer = Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk);
    total += buffer.length;
    if (total > 64 * 1024) {
      throw new Error("Request body exceeds 64 KiB");
    }
    chunks.push(buffer);
  }
  return JSON.parse(Buffer.concat(chunks).toString("utf8"));
}

function writeJson(response: ServerResponse, statusCode: number, value: unknown): void {
  response.writeHead(statusCode, {
    "content-type": "application/json; charset=utf-8",
    "cache-control": "no-store",
  });
  response.end(`${JSON.stringify(value, null, 2)}\n`);
}

async function serveStatic(pathname: string, response: ServerResponse): Promise<void> {
  const requested = pathname === "/" ? "index.html" : pathname.replace(/^\/+/, "");
  const fullPath = resolve(webRoot, requested);
  if (!fullPath.startsWith(webRoot)) {
    writeJson(response, 403, { error: "Forbidden" });
    return;
  }
  let fileStat;
  try {
    fileStat = await stat(fullPath);
  } catch {
    writeJson(response, 404, { error: "Not found" });
    return;
  }
  if (!fileStat.isFile()) {
    writeJson(response, 404, { error: "Not found" });
    return;
  }
  response.writeHead(200, {
    "content-type": mimeType(fullPath),
    "cache-control": "no-store",
  });
  createReadStream(fullPath).pipe(response);
}

function mimeType(path: string): string {
  switch (extname(path)) {
    case ".html":
      return "text/html; charset=utf-8";
    case ".js":
      return "text/javascript; charset=utf-8";
    case ".css":
      return "text/css; charset=utf-8";
    case ".json":
      return "application/json; charset=utf-8";
    default:
      return "application/octet-stream";
  }
}
