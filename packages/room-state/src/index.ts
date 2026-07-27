import type { AudioRoute, RoomNode, RoomState, SemanticCommand } from "../../contracts/src/index.js";
import { applyRoutePolicy, assertValidGraph } from "../../media-graph/src/index.js";

const BASE_TIME_MS = Date.parse("2026-07-27T00:00:00.000Z");

export interface MutableRoomState {
  roomId: string;
  revision: number;
  activeScene: string;
  emergencySilence: boolean;
  humansOnly: boolean;
  nodes: RoomNode[];
  routes: AudioRoute[];
  manuallyMutedNodeIds: Set<string>;
  updatedAt: string;
}

function timestampForRevision(revision: number): string {
  return new Date(BASE_TIME_MS + revision * 1_000).toISOString();
}

function snapshot(state: MutableRoomState): RoomState {
  const routes = applyRoutePolicy(state.nodes, state.routes, {
    emergencySilence: state.emergencySilence,
    humansOnly: state.humansOnly,
    manuallyMutedNodeIds: state.manuallyMutedNodeIds,
  });
  return {
    roomId: state.roomId,
    revision: state.revision,
    activeScene: state.activeScene,
    emergencySilence: state.emergencySilence,
    humansOnly: state.humansOnly,
    nodes: state.nodes.map((node) => ({ ...node, capabilities: [...node.capabilities], state: { ...node.state } })),
    routes,
    updatedAt: state.updatedAt,
  };
}

export class RoomStore {
  readonly #state: MutableRoomState;
  readonly #listeners = new Set<(state: RoomState) => void>();

  public constructor(initialState: MutableRoomState) {
    assertValidGraph(initialState.nodes, initialState.routes);
    this.#state = initialState;
  }

  public getState(): RoomState {
    return snapshot(this.#state);
  }

  public subscribe(listener: (state: RoomState) => void): () => void {
    this.#listeners.add(listener);
    listener(this.getState());
    return () => this.#listeners.delete(listener);
  }

  public apply(command: SemanticCommand): RoomState {
    switch (command.type) {
      case "room.scene.activate":
        this.#state.activeScene = command.sceneId;
        break;
      case "room.emergency_silence.set":
        this.#state.emergencySilence = command.enabled;
        if (command.enabled) {
          this.#state.activeScene = "06 EMERGENCY SILENCE";
        }
        break;
      case "room.humans_only.set":
        this.#state.humansOnly = command.enabled;
        if (command.enabled) {
          this.#state.activeScene = "05 HUMANS ONLY";
        }
        break;
      case "room.participant.mute":
        if (!this.#state.nodes.some((node) => node.id === command.participantId)) {
          throw new Error(`Unknown participant ${command.participantId}`);
        }
        if (command.muted) {
          this.#state.manuallyMutedNodeIds.add(command.participantId);
        } else {
          this.#state.manuallyMutedNodeIds.delete(command.participantId);
        }
        break;
      case "obs.scene.activate":
      case "phone.status.read":
        break;
      default: {
        const neverCommand: never = command;
        throw new Error(`Unsupported command ${JSON.stringify(neverCommand)}`);
      }
    }

    this.#state.revision += 1;
    this.#state.updatedAt = timestampForRevision(this.#state.revision);
    const next = this.getState();
    for (const listener of this.#listeners) {
      listener(next);
    }
    return next;
  }
}

export function createDeterministicRoomStore(): RoomStore {
  const nodes: RoomNode[] = [
    {
      id: "human-local",
      label: "Local Human (simulated input)",
      kind: "human",
      simulated: true,
      capabilities: ["hear", "speak", "see", "act", "share"],
      state: { audio: "connected", visual: "watching", tools: "connected", work: "idle" },
    },
    {
      id: "phone-link-sim",
      label: "Phone Link (simulator)",
      kind: "phone",
      simulated: true,
      capabilities: ["hear", "speak", "see"],
      state: { audio: "connected", visual: "presenting", tools: "restricted", work: "idle" },
    },
    {
      id: "ai-voice-sim",
      label: "AI Voice App (simulator)",
      kind: "ai-app",
      simulated: true,
      capabilities: ["hear", "speak"],
      state: { audio: "connected", visual: "none", tools: "none", work: "idle" },
    },
  ];

  const routes: AudioRoute[] = [
    route("human-to-phone", "human-local", "phone-link-sim"),
    route("phone-to-human", "phone-link-sim", "human-local"),
    route("human-to-ai", "human-local", "ai-voice-sim"),
    route("phone-to-ai", "phone-link-sim", "ai-voice-sim"),
    route("ai-to-human", "ai-voice-sim", "human-local"),
    route("ai-to-phone", "ai-voice-sim", "phone-link-sim"),
  ];

  return new RoomStore({
    roomId: "sol-room-simulator",
    revision: 0,
    activeScene: "01 LAB OVERVIEW",
    emergencySilence: false,
    humansOnly: false,
    nodes,
    routes,
    manuallyMutedNodeIds: new Set<string>(),
    updatedAt: timestampForRevision(0),
  });
}

function route(id: string, sourceNodeId: string, destinationNodeId: string): AudioRoute {
  return { id, sourceNodeId, destinationNodeId, requested: true, effective: true, blockedBy: [] };
}
