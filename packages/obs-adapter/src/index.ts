import { createHash, randomUUID } from "node:crypto";
import type { ObsSceneState } from "../../contracts/src/index.js";

export interface ObsAdapter {
  readonly kind: "mock" | "obs-websocket";
  connect(): Promise<void>;
  disconnect(): Promise<void>;
  getSceneState(): Promise<ObsSceneState>;
  activateScene(sceneName: string): Promise<ObsSceneState>;
}

const DEFAULT_SCENES = [
  "01 LAB OVERVIEW",
  "02 PHONE CALL",
  "03 AI ROOM",
  "04 WORK WALL",
  "05 HUMANS ONLY",
  "06 EMERGENCY SILENCE",
] as const;

export class MockObsAdapter implements ObsAdapter {
  public readonly kind = "mock" as const;
  readonly #scenes: string[];
  #currentProgramScene: string;

  public constructor(scenes: readonly string[] = DEFAULT_SCENES) {
    this.#scenes = [...scenes];
    this.#currentProgramScene = this.#scenes[0] ?? "01 LAB OVERVIEW";
  }

  public async connect(): Promise<void> {}
  public async disconnect(): Promise<void> {}

  public async getSceneState(): Promise<ObsSceneState> {
    return {
      adapter: "mock",
      currentProgramScene: this.#currentProgramScene,
      scenes: [...this.#scenes],
      simulated: true,
    };
  }

  public async activateScene(sceneName: string): Promise<ObsSceneState> {
    if (!this.#scenes.includes(sceneName)) {
      throw new Error(`Unknown OBS scene ${sceneName}`);
    }
    this.#currentProgramScene = sceneName;
    return this.getSceneState();
  }
}

interface PendingRequest {
  readonly resolve: (value: Record<string, unknown>) => void;
  readonly reject: (error: Error) => void;
}

export interface ObsWebSocketAdapterOptions {
  readonly url: string;
  readonly password?: string;
  readonly requestTimeoutMs?: number;
}

export class ObsWebSocketAdapter implements ObsAdapter {
  public readonly kind = "obs-websocket" as const;
  readonly #options: ObsWebSocketAdapterOptions;
  readonly #pending = new Map<string, PendingRequest>();
  #socket: WebSocket | undefined;
  #identified: Promise<void> | undefined;

  public constructor(options: ObsWebSocketAdapterOptions) {
    this.#options = options;
  }

  public async connect(): Promise<void> {
    if (this.#identified !== undefined) {
      return this.#identified;
    }
    this.#identified = new Promise<void>((resolve, reject) => {
      const socket = new WebSocket(this.#options.url);
      this.#socket = socket;
      const timeout = setTimeout(() => reject(new Error("OBS WebSocket identify timeout")), this.#timeoutMs());

      socket.addEventListener("message", (event) => {
        void this.#onMessage(String(event.data), resolve, reject, timeout);
      });
      socket.addEventListener("error", () => reject(new Error("OBS WebSocket connection failed")));
      socket.addEventListener("close", () => {
        for (const pending of this.#pending.values()) {
          pending.reject(new Error("OBS WebSocket disconnected"));
        }
        this.#pending.clear();
        this.#socket = undefined;
        this.#identified = undefined;
      });
    });
    return this.#identified;
  }

  public async disconnect(): Promise<void> {
    this.#socket?.close();
    this.#socket = undefined;
    this.#identified = undefined;
  }

  public async getSceneState(): Promise<ObsSceneState> {
    const response = await this.#request("GetSceneList", {});
    const scenesValue = response["scenes"];
    const currentValue = response["currentProgramSceneName"];
    const scenes = Array.isArray(scenesValue)
      ? scenesValue
          .map((scene) => (isRecord(scene) ? scene["sceneName"] : undefined))
          .filter((scene): scene is string => typeof scene === "string")
      : [];
    if (typeof currentValue !== "string") {
      throw new Error("OBS returned no current program scene");
    }
    return {
      adapter: "obs-websocket",
      currentProgramScene: currentValue,
      scenes,
      simulated: false,
    };
  }

  public async activateScene(sceneName: string): Promise<ObsSceneState> {
    await this.#request("SetCurrentProgramScene", { sceneName });
    const readback = await this.#request("GetCurrentProgramScene", {});
    if (readback["currentProgramSceneName"] !== sceneName) {
      throw new Error(`OBS scene readback mismatch for ${sceneName}`);
    }
    return this.getSceneState();
  }

  async #onMessage(
    raw: string,
    resolveIdentified: () => void,
    rejectIdentified: (error: Error) => void,
    identifyTimeout: ReturnType<typeof setTimeout>,
  ): Promise<void> {
    let payload: unknown;
    try {
      payload = JSON.parse(raw);
    } catch {
      return;
    }
    if (!isRecord(payload) || typeof payload["op"] !== "number") {
      return;
    }
    const op = payload["op"];
    const data = isRecord(payload["d"]) ? payload["d"] : {};
    if (op === 0) {
      const identify: Record<string, unknown> = { rpcVersion: 1 };
      const authentication = data["authentication"];
      if (isRecord(authentication)) {
        const challenge = authentication["challenge"];
        const salt = authentication["salt"];
        if (typeof challenge !== "string" || typeof salt !== "string" || this.#options.password === undefined) {
          rejectIdentified(new Error("OBS WebSocket requires a password"));
          return;
        }
        identify["authentication"] = obsAuthentication(this.#options.password, salt, challenge);
      }
      this.#send({ op: 1, d: identify });
      return;
    }
    if (op === 2) {
      clearTimeout(identifyTimeout);
      resolveIdentified();
      return;
    }
    if (op === 7) {
      const requestId = data["requestId"];
      if (typeof requestId !== "string") {
        return;
      }
      const pending = this.#pending.get(requestId);
      if (pending === undefined) {
        return;
      }
      this.#pending.delete(requestId);
      const status = isRecord(data["requestStatus"]) ? data["requestStatus"] : {};
      if (status["result"] !== true) {
        pending.reject(new Error(String(status["comment"] ?? "OBS request failed")));
        return;
      }
      pending.resolve(isRecord(data["responseData"]) ? data["responseData"] : {});
    }
  }

  async #request(requestType: string, requestData: Record<string, unknown>): Promise<Record<string, unknown>> {
    await this.connect();
    const requestId = randomUUID();
    return new Promise<Record<string, unknown>>((resolve, reject) => {
      const timer = setTimeout(() => {
        this.#pending.delete(requestId);
        reject(new Error(`OBS request ${requestType} timed out`));
      }, this.#timeoutMs());
      this.#pending.set(requestId, {
        resolve: (value) => {
          clearTimeout(timer);
          resolve(value);
        },
        reject: (error) => {
          clearTimeout(timer);
          reject(error);
        },
      });
      this.#send({ op: 6, d: { requestType, requestId, requestData } });
    });
  }

  #send(payload: unknown): void {
    if (this.#socket === undefined || this.#socket.readyState !== WebSocket.OPEN) {
      throw new Error("OBS WebSocket is not connected");
    }
    this.#socket.send(JSON.stringify(payload));
  }

  #timeoutMs(): number {
    return this.#options.requestTimeoutMs ?? 5_000;
  }
}

function obsAuthentication(password: string, salt: string, challenge: string): string {
  const secret = createHash("sha256").update(password + salt).digest("base64");
  return createHash("sha256").update(secret + challenge).digest("base64");
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}
