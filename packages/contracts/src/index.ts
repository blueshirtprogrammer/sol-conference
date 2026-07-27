export type Capability = "hear" | "speak" | "see" | "act" | "share";

export type NodeKind =
  | "human"
  | "phone"
  | "ai-app"
  | "working-agent"
  | "local-model"
  | "meeting-app"
  | "media"
  | "screen"
  | "camera"
  | "artifact"
  | "room-device";

export type AudioState = "connected" | "muted" | "isolated" | "unavailable";
export type VisualState = "watching" | "presenting" | "private" | "none";
export type ToolState = "connected" | "restricted" | "executing" | "none";
export type WorkState = "idle" | "working" | "blocked" | "ready";
export type RouteBlockReason = "emergency-silence" | "humans-only" | "manual-mute";

export interface NodeState {
  readonly audio: AudioState;
  readonly visual: VisualState;
  readonly tools: ToolState;
  readonly work: WorkState;
}

export interface RoomNode {
  readonly id: string;
  readonly label: string;
  readonly kind: NodeKind;
  readonly simulated: boolean;
  readonly capabilities: readonly Capability[];
  readonly state: NodeState;
}

export interface AudioRoute {
  readonly id: string;
  readonly sourceNodeId: string;
  readonly destinationNodeId: string;
  readonly requested: boolean;
  readonly effective: boolean;
  readonly blockedBy: readonly RouteBlockReason[];
}

export interface RoomState {
  readonly roomId: string;
  readonly revision: number;
  readonly activeScene: string;
  readonly emergencySilence: boolean;
  readonly humansOnly: boolean;
  readonly nodes: readonly RoomNode[];
  readonly routes: readonly AudioRoute[];
  readonly updatedAt: string;
}

export type SemanticCommand =
  | { readonly type: "room.scene.activate"; readonly sceneId: string }
  | { readonly type: "room.emergency_silence.set"; readonly enabled: boolean }
  | { readonly type: "room.humans_only.set"; readonly enabled: boolean }
  | {
      readonly type: "room.participant.mute";
      readonly participantId: string;
      readonly muted: boolean;
    }
  | { readonly type: "obs.scene.activate"; readonly sceneName: string }
  | { readonly type: "phone.status.read" };

export interface CommandResult<T = unknown> {
  readonly ok: boolean;
  readonly commandType: SemanticCommand["type"];
  readonly room: RoomState;
  readonly data?: T;
  readonly error?: string;
  readonly warnings?: readonly string[];
}

export interface HealthStatus {
  readonly status: "ok" | "degraded";
  readonly service: "sol-fabric";
  readonly version: string;
  readonly obs: "mock" | "connected" | "disconnected";
  readonly phone: "simulated" | "connected" | "disconnected";
}

export interface PhoneStatus {
  readonly adapter: "simulator" | "phone-link";
  readonly connection: "connected" | "disconnected";
  readonly callState: "idle" | "ringing" | "active" | "held";
  readonly simulated: boolean;
}

export interface ObsSceneState {
  readonly adapter: "mock" | "obs-websocket";
  readonly currentProgramScene: string;
  readonly scenes: readonly string[];
  readonly simulated: boolean;
}
